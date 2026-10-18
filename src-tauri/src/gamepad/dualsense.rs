//! The DualSense touchpad, which neither gilrs nor the WebView's Gamepad API
//! reports. A finger on it moves Harbor's controller pointer and its click is
//! a bindable button ("touchpad").
//!
//! Windows: the pad is read whole from its HID reports (USB report 0x01,
//! Bluetooth report 0x31), buttons and sticks included. Over Bluetooth the
//! pad only sends a short report without the touchpad until a calibration
//! feature report is read, and the long report it then sends has no layout
//! the WebView understands, so Harbor becomes the pad's only source and the
//! frontend drops the WebView's copy (GamepadInfo::hid).
//!
//! Linux: gilrs keeps the buttons and sticks. The kernel (hid-playstation)
//! exposes the touchpad as its own touchpad device, which the desktop would
//! use to move the system pointer, so Harbor reads that device and grabs it
//! while it takes controller input. Opening it needs the udev rule the
//! packages install (udev/70-harbor-dualsense.rules).

#[cfg(any(windows, target_os = "linux"))]
const HID_PAD_ID: u32 = 5000;

/// Buttons in the order of `PadState::buttons`' bits.
#[cfg(any(windows, test))]
const BUTTONS: [&str; 18] = [
    "south", "east", "west", "north", "lb", "rb", "lt", "rt", "back", "start", "guide", "lstick",
    "rstick", "dup", "ddown", "dleft", "dright", "touchpad",
];

#[cfg(any(windows, test))]
const AXES: [&str; 4] = ["lx", "ly", "rx", "ry"];

#[cfg(any(windows, test))]
#[derive(Clone, Copy, Default, PartialEq, Debug)]
struct PadState {
    buttons: u32,
    sticks: [u8; 4],
    /// First finger on the touchpad, in touchpad units (1920 x 1080), when
    /// the report carries the touchpad at all.
    touch: Option<Option<(u16, u16)>>,
}

#[cfg(any(windows, test))]
fn bit(on: bool, index: usize) -> u32 {
    if on {
        1 << index
    } else {
        0
    }
}

/// `sticks` is LX, LY, RX, RY; `b` the three button bytes; `l2`/`r2` the
/// trigger positions. The layout is the one hid-playstation reads.
#[cfg(any(windows, test))]
fn decode(sticks: &[u8], b: &[u8], l2: u8, r2: u8) -> PadState {
    let hat = b[0] & 0x0f;
    let up = matches!(hat, 0 | 1 | 7);
    let right = matches!(hat, 1..=3);
    let down = matches!(hat, 3..=5);
    let left = matches!(hat, 5..=7);
    let buttons = bit(b[0] & 0x20 != 0, 0)
        | bit(b[0] & 0x40 != 0, 1)
        | bit(b[0] & 0x10 != 0, 2)
        | bit(b[0] & 0x80 != 0, 3)
        | bit(b[1] & 0x01 != 0, 4)
        | bit(b[1] & 0x02 != 0, 5)
        // The triggers count as pressed halfway down, as in the WebView.
        | bit(l2 >= 128, 6)
        | bit(r2 >= 128, 7)
        | bit(b[1] & 0x10 != 0, 8)
        | bit(b[1] & 0x20 != 0, 9)
        | bit(b[2] & 0x01 != 0, 10)
        | bit(b[1] & 0x40 != 0, 11)
        | bit(b[1] & 0x80 != 0, 12)
        | bit(up, 13)
        | bit(down, 14)
        | bit(left, 15)
        | bit(right, 16)
        | bit(b[2] & 0x02 != 0, 17);
    PadState {
        buttons,
        sticks: [sticks[0], sticks[1], sticks[2], sticks[3]],
        touch: None,
    }
}

/// A touch point: bit 7 of the first byte set means no finger.
#[cfg(any(windows, test))]
fn touch_point(p: &[u8]) -> Option<(u16, u16)> {
    if p[0] & 0x80 != 0 {
        return None;
    }
    let x = p[1] as u16 | ((p[2] as u16 & 0x0f) << 8);
    let y = (p[2] as u16 >> 4) | ((p[3] as u16) << 4);
    Some((x, y))
}

#[cfg(any(windows, test))]
#[derive(Debug, PartialEq)]
enum Report {
    State(PadState),
    /// The short Bluetooth report: the pad still has to be asked for the
    /// long one, which carries the touchpad.
    BluetoothShort(PadState),
}

#[cfg(any(windows, test))]
fn parse_report(buf: &[u8]) -> Option<Report> {
    match (buf.first()?, buf.len()) {
        // USB: the full report right after its id.
        (0x01, n) if n >= 64 => Some(Report::State(full_report(&buf[1..]))),
        // Bluetooth before the switch: sticks, buttons, then the triggers.
        (0x01, n) if n >= 10 => Some(Report::BluetoothShort(decode(
            &buf[1..5],
            &buf[5..8],
            buf[8],
            buf[9],
        ))),
        // Bluetooth after the switch: one more byte before the same layout.
        (0x31, n) if n >= 78 => Some(Report::State(full_report(&buf[2..]))),
        _ => None,
    }
}

#[cfg(any(windows, test))]
fn full_report(d: &[u8]) -> PadState {
    let mut state = decode(&d[0..4], &d[7..10], d[4], d[5]);
    state.touch = Some(touch_point(&d[32..36]));
    state
}

#[cfg(any(windows, test))]
fn stick_value(raw: u8) -> f32 {
    ((raw as f32 - 127.5) / 127.5).clamp(-1.0, 1.0)
}

pub fn spawn(app: tauri::AppHandle) {
    #[cfg(windows)]
    std::thread::spawn(move || hid_windows::run(app));
    #[cfg(target_os = "linux")]
    std::thread::spawn(move || linux::run(app));
    #[cfg(not(any(windows, target_os = "linux")))]
    let _ = app;
}

#[cfg(windows)]
mod hid_windows {
    use super::super::{
        emit, emit_input, remove, touchpad_pointer, upsert_info, GamepadEventPayload,
    };
    use super::{parse_report, stick_value, PadState, Report, AXES, BUTTONS, HID_PAD_ID};
    use std::time::Duration;
    use tauri::AppHandle;

    const SONY: u16 = 0x054c;
    // DualSense and DualSense Edge.
    const PRODUCTS: [u16; 2] = [0x0ce6, 0x0df2];
    const CALIBRATION_REPORT: u8 = 0x05;

    pub fn run(app: AppHandle) {
        let mut api = match hidapi::HidApi::new() {
            Ok(api) => api,
            Err(e) => {
                eprintln!("[harbor::gamepad] hid init failed: {e}");
                return;
            }
        };
        loop {
            let _ = api.refresh_devices();
            let found = api
                .device_list()
                .find(|d| d.vendor_id() == SONY && PRODUCTS.contains(&d.product_id()))
                .map(|d| {
                    (
                        d.path().to_owned(),
                        d.product_string()
                            .filter(|s| !s.is_empty())
                            .unwrap_or("DualSense Wireless Controller")
                            .to_string(),
                    )
                });
            if let Some((path, name)) = found {
                if let Ok(device) = api.open_path(&path) {
                    read_device(&app, &device, &name);
                }
            }
            std::thread::sleep(Duration::from_secs(2));
        }
    }

    fn read_device(app: &AppHandle, device: &hidapi::HidDevice, name: &str) {
        upsert_info(HID_PAD_ID, name, true);
        emit(
            app,
            GamepadEventPayload::Connected {
                id: HID_PAD_ID,
                name: name.to_string(),
            },
        );
        let mut prev = PadState::default();
        let mut asked_for_long_report = false;
        let mut buf = [0u8; 128];
        loop {
            let n = match device.read_timeout(&mut buf, 100) {
                Ok(n) => n,
                Err(_) => break,
            };
            if n == 0 {
                continue;
            }
            let state = match parse_report(&buf[..n]) {
                Some(Report::State(state)) => state,
                Some(Report::BluetoothShort(state)) => {
                    if !asked_for_long_report {
                        asked_for_long_report = true;
                        let mut feature = [0u8; 41];
                        feature[0] = CALIBRATION_REPORT;
                        let _ = device.get_feature_report(&mut feature);
                    }
                    PadState {
                        touch: prev.touch,
                        ..state
                    }
                }
                None => continue,
            };
            emit_changes(app, &prev, &state);
            prev = state;
        }
        remove(HID_PAD_ID);
        emit(app, GamepadEventPayload::Disconnected { id: HID_PAD_ID });
    }

    fn emit_changes(app: &AppHandle, prev: &PadState, next: &PadState) {
        let changed = prev.buttons ^ next.buttons;
        for (i, &button) in BUTTONS.iter().enumerate() {
            if changed & (1 << i) != 0 {
                emit_input(
                    app,
                    GamepadEventPayload::Button {
                        id: HID_PAD_ID,
                        button,
                        pressed: next.buttons & (1 << i) != 0,
                    },
                );
            }
        }
        for (i, &axis) in AXES.iter().enumerate() {
            if prev.sticks[i] != next.sticks[i] {
                emit_input(
                    app,
                    GamepadEventPayload::Axis {
                        id: HID_PAD_ID,
                        axis,
                        value: stick_value(next.sticks[i]),
                    },
                );
            }
        }
        if let Some(touch) = next.touch.filter(|_| touchpad_pointer()) {
            if prev.touch != Some(touch) {
                let (x, y) = touch.unwrap_or_default();
                emit_input(
                    app,
                    GamepadEventPayload::Touch {
                        id: HID_PAD_ID,
                        x: x as f32 / 1920.0,
                        y: y as f32 / 1080.0,
                        touching: touch.is_some(),
                    },
                );
            }
        }
    }
}

#[cfg(target_os = "linux")]
mod linux {
    use super::super::{emit_input, input_allowed, touchpad_pointer, GamepadEventPayload};
    use super::HID_PAD_ID;
    use std::fs::{self, File, OpenOptions};
    use std::io::{ErrorKind, Read};
    use std::os::fd::AsRawFd;
    use std::os::unix::fs::OpenOptionsExt;
    use std::path::PathBuf;
    use std::time::Duration;
    use tauri::AppHandle;

    const EV_SYN: u16 = 0;
    const EV_KEY: u16 = 1;
    const EV_ABS: u16 = 3;
    const ABS_X: u16 = 0;
    const ABS_Y: u16 = 1;
    const BTN_LEFT: u16 = 0x110;
    const BTN_TOUCH: u16 = 0x14a;
    // _IOW('E', 0x90, int) and _IOR('E', 0x40 + axis, struct input_absinfo).
    const EVIOCGRAB: u64 = 0x4004_4590;
    const EVIOCGABS: u64 = 0x8018_4540;
    // struct input_event on 64-bit Linux: a timeval, then type, code, value.
    const EVENT_SIZE: usize = 24;

    /// The kernel's touchpad device of a DualSense (or Edge), by its name:
    /// "... DualSense Wireless Controller Touchpad".
    fn find_touchpad() -> Option<PathBuf> {
        for entry in fs::read_dir("/sys/class/input").ok()?.flatten() {
            let node = entry.file_name();
            let node = node.to_string_lossy();
            if !node.starts_with("event") {
                continue;
            }
            let name = fs::read_to_string(entry.path().join("device/name")).unwrap_or_default();
            let name = name.trim();
            if name.contains("DualSense") && name.ends_with("Touchpad") {
                return Some(PathBuf::from("/dev/input").join(&*node));
            }
        }
        None
    }

    fn axis_max(file: &File, axis: u16, fallback: i32) -> i32 {
        // value, minimum, maximum, fuzz, flat, resolution
        let mut info = [0i32; 6];
        let ok = unsafe {
            libc::ioctl(
                file.as_raw_fd(),
                (EVIOCGABS + axis as u64) as _,
                info.as_mut_ptr(),
            )
        } == 0;
        if ok && info[2] > 0 {
            info[2]
        } else {
            fallback
        }
    }

    fn set_grab(file: &File, on: bool) {
        unsafe {
            libc::ioctl(file.as_raw_fd(), EVIOCGRAB as _, on as libc::c_int);
        }
    }

    pub fn run(app: AppHandle) {
        let mut warned = false;
        loop {
            if let Some(path) = find_touchpad() {
                match OpenOptions::new()
                    .read(true)
                    .custom_flags(libc::O_NONBLOCK)
                    .open(&path)
                {
                    Ok(file) => {
                        warned = false;
                        read_touchpad(&app, file);
                    }
                    Err(e) if !warned => {
                        warned = true;
                        eprintln!(
                            "[harbor::gamepad] cannot open the DualSense touchpad ({}): {e}",
                            path.display()
                        );
                    }
                    Err(_) => {}
                }
            }
            std::thread::sleep(Duration::from_secs(2));
        }
    }

    fn read_touchpad(app: &AppHandle, mut file: File) {
        let max_x = axis_max(&file, ABS_X, 1919) as f32;
        let max_y = axis_max(&file, ABS_Y, 1079) as f32;
        let mut grabbed = false;
        let (mut x, mut y, mut touching) = (0i32, 0i32, false);
        let mut sent = (0i32, 0i32, false);
        let mut buf = [0u8; EVENT_SIZE * 64];
        loop {
            // Held only while Harbor takes controller input and the setting
            // is on, so the touchpad keeps moving the system pointer in other
            // windows (and everywhere when the setting is off).
            let want = input_allowed() && touchpad_pointer();
            if want != grabbed {
                set_grab(&file, want);
                grabbed = want;
            }
            let n = match file.read(&mut buf) {
                Ok(0) => break,
                Ok(n) => n,
                Err(e) if e.kind() == ErrorKind::WouldBlock => {
                    std::thread::sleep(Duration::from_millis(8));
                    continue;
                }
                Err(e) if e.kind() == ErrorKind::Interrupted => continue,
                Err(_) => break,
            };
            for ev in buf[..n].chunks_exact(EVENT_SIZE) {
                let kind = u16::from_ne_bytes([ev[16], ev[17]]);
                let code = u16::from_ne_bytes([ev[18], ev[19]]);
                let value = i32::from_ne_bytes([ev[20], ev[21], ev[22], ev[23]]);
                match (kind, code) {
                    (EV_ABS, ABS_X) => x = value,
                    (EV_ABS, ABS_Y) => y = value,
                    (EV_KEY, BTN_TOUCH) => touching = value != 0,
                    (EV_KEY, BTN_LEFT) if value != 2 && grabbed => emit_input(
                        app,
                        GamepadEventPayload::Button {
                            id: HID_PAD_ID,
                            button: "touchpad",
                            pressed: value != 0,
                        },
                    ),
                    (EV_SYN, 0) if grabbed && (x, y, touching) != sent => {
                        sent = (x, y, touching);
                        emit_input(
                            app,
                            GamepadEventPayload::Touch {
                                id: HID_PAD_ID,
                                x: x as f32 / max_x,
                                y: y as f32 / max_y,
                                touching,
                            },
                        );
                    }
                    _ => {}
                }
            }
        }
        if grabbed {
            set_grab(&file, false);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{parse_report, touch_point, PadState, Report, BUTTONS};

    fn pressed(state: &PadState) -> Vec<&'static str> {
        BUTTONS
            .iter()
            .enumerate()
            .filter(|(i, _)| state.buttons & (1 << i) != 0)
            .map(|(_, b)| *b)
            .collect()
    }

    #[test]
    fn reads_usb_buttons_sticks_and_touch() {
        let mut r = [0u8; 64];
        r[0] = 0x01;
        r[1..5].copy_from_slice(&[0, 255, 128, 128]);
        r[5] = 200; // L2 past halfway
        r[8] = 0x20 | 0x02; // cross, D-pad right (hat 2)
        r[9] = 0x01 | 0x20; // L1, options
        r[10] = 0x02; // touchpad click
                      // Touch point 0 at (1000, 500), finger down.
        r[33..37].copy_from_slice(&[0x01, 0xe8, 0x43, 0x1f]);
        let Some(Report::State(state)) = parse_report(&r) else {
            panic!("not a full report");
        };
        assert_eq!(
            pressed(&state),
            ["south", "lb", "lt", "start", "dright", "touchpad"]
        );
        assert_eq!(state.sticks, [0, 255, 128, 128]);
        assert_eq!(state.touch, Some(Some((1000, 500))));
    }

    #[test]
    fn reads_the_long_bluetooth_report_one_byte_later() {
        let mut r = [0u8; 78];
        r[0] = 0x31;
        r[2..6].copy_from_slice(&[10, 20, 30, 40]);
        r[9] = 0x08; // hat 8: D-pad released
        r[34] = 0x80; // no finger
        let Some(Report::State(state)) = parse_report(&r) else {
            panic!("not a full report");
        };
        assert!(pressed(&state).is_empty());
        assert_eq!(state.sticks, [10, 20, 30, 40]);
        assert_eq!(state.touch, Some(None));
    }

    #[test]
    fn the_short_bluetooth_report_asks_for_the_long_one() {
        let mut r = [0u8; 10];
        r[0] = 0x01;
        r[5] = 0x80 | 0x07; // triangle, D-pad up-left
        assert!(matches!(
            parse_report(&r),
            Some(Report::BluetoothShort(s)) if pressed(&s) == ["north", "dup", "dleft"]
        ));
    }

    #[test]
    fn touch_points_unpack_twelve_bit_coordinates() {
        assert_eq!(touch_point(&[0x00, 0x7f, 0x07, 0x00]), Some((1919, 0)));
        assert_eq!(touch_point(&[0x00, 0x00, 0x70, 0x43]), Some((0, 1079)));
        assert_eq!(touch_point(&[0x80, 0x10, 0x10, 0x10]), None);
    }
}
