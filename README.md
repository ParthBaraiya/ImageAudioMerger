# ImageAudioMerger

This web based project takes jpg image and aac audio as input and merge them in a mp4 video file.

### Used Technology

- html
- css
- php
- Jquery
- ajax
- ffmpeg

## Requirements

- ffmpeg ([Download](https://ffmpeg.zeranoe.com/builds/))
- Server (Recommanded WAMP server) ([Download](http://wampserver.aviatechno.net/))

## Notes

- Make sure that `shell_exec` command is enabled in your server if not then enable it.
  To enable `shell_exec` function search for php.ini file on your server.
  In php.ini search for **disabled_functions** and remove **shell_exec** function from it.
