# FW for Custom AMG8833 PCB
The hardware reuses a PCB which was designed for another project, but ultimately wasn’t needed. The PCB uses an STM32f103 microcontroller and a CH340G serial to USB bridge. The board has a micro-USB port which is used for both power and data.  

A GUI app to view and record data from the sensors can be found [here](https://github.com/natfaulk/thermal-logger)  

This firmware uses an STM32 plugin for [Arduino](https://github.com/stm32duino/Arduino_Core_STM32)  
Also required is the [Adafruit AMG88xx library](https://github.com/adafruit/Adafruit_AMG88xx)  
