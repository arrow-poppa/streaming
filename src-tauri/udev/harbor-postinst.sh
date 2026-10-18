#!/bin/sh
# Apply the PlayStation touchpad rule to a controller that is already connected.
udevadm control --reload-rules >/dev/null 2>&1 || :
udevadm trigger --subsystem-match=input --action=change >/dev/null 2>&1 || :
