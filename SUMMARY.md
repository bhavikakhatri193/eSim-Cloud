// Summary of the Project // 
// DHT11 Sensor interfacing with Arduino
To read from the DHT sensor, we’ll use the DHT library from Adafruit. To use this library you also need to install the Adafruit Unified Sensor library
Open your Arduino IDE and go to Sketch > Include Library > Manage Libraries. The Library Manager should open.
Search for “DHT” on the Search box and install the DHT library from Adafruit
After installing the DHT library from Adafruit, type “Adafruit Unified Sensor” in the search box. Scroll all the way down to find the library and install it.
After installing the libraries, restart your Arduino IDE.
You start by including the DHT library and then you define the pin that the DHT sensor is connected to.Then, you need to define the DHT sensor type you’re using.  we’re using the DHT11.
Then, initialize a DHT object called dht with the pin and type you’ve defined previously
Initialize the DHT sensor with the .begin() method.In the loop(), at the beginning, there’s a delay of 2 seconds. This delay is needed to give enough time for the sensor to take readings. The maximum sampling rate is two seconds for the DHT22 and one second for the DHT11.
Reading temperature and humidity is very simple. To get humidity, you just need to use the readHumidity() method on the dht object. In this case, we’re saving the humidity in the h variable. Note that the readHumidity() method returns a value of type float.
Similarly, to read temperature use the readTemperature() method.
Tto get temperature in Fahrenheit degrees, just pass true to the readTemperature() method as follows.
Finally, all readings are displayed on the Serial Monitor.
After uploading the code to the Arduino, open the Serial Monitor at a baud rate of 9600. You should get sensor readings every two seconds. Here’s what you should see in your Arduino IDE Serial Monitor.
// L293D Motor Driver IC using Arduino
In order to have a complete control over DC motor, we have to control its speed and rotation direction. This can be achieved by combining these two techniques.
PWM – For controlling speed
H-Bridge – For controlling rotation direction
The speed of a DC motor can be controlled by varying its input voltage. A common technique for doing this is to use PWM (Pulse Width Modulation)
PWM is a technique where average value of the input voltage is adjusted by sending a series of ON-OFF pulses.
The average voltage is proportional to the width of the pulses known as Duty Cycle.
The L293D is a dual-channel H-Bridge motor driver capable of driving a pair of DC motors or one stepper motor.
That means it can individually drive up to two motors making it ideal for building two-wheel robot platforms.
The L293D motor driver IC actually has two power input pins viz. ‘Vcc1’ and ‘Vcc2’, Vcc1 is used for driving the internal logic circuitry which should be 5V.
From Vcc2 pin the H-Bridge gets its power for driving the motors which can be 4.5V to 36V. And they both sink to a common ground named GND.
The L293D motor driver’s output channels for the motor A and B are brought out to pins OUT1,OUT2 and OUT3,OUT4 respectively.You can connect two DC motors having voltages between 4.5 to 36V to these terminals.
Each channel on the IC can deliver up to 600mA to the DC motor. However, the amount of current supplied to the motor depends on system’s power supply.
For each of the L293D’s channels, there are two types of control pins which allow us to control speed and spinning direction of the DC motors at the same time viz. Direction control pins & Speed control pins.
Using the direction control pins, we can control whether the motor spins forward or backward. These pins actually control the switches of the H-Bridge circuit inside L293D IC.
The IC has two direction control pins for each channel. The IN1,IN2 pins control the spinning direction of the motor A while IN3,IN4 control motor B.
The spinning direction of a motor can be controlled by applying either a logic HIGH(5 Volts) or logic LOW(Ground) to these pins.
The speed control pins viz. ENA and ENB are used to turn ON, OFF and control speed of motor A and motor B respectively.
Pulling these pins HIGH will make the motors spin, pulling it LOW will make them stop. But, with Pulse Width Modulation (PWM), we can actually control the speed of the motors.
Next, we need to supply 5 Volts for the L293D’s logic circuitry. Connect Vcc1 pin to 5V output on Arduino. Make sure you common all the grounds in the circuit.
Now, the input and enable pins(ENA, IN1, IN2, IN3, IN4 and ENB) of the L293D IC are connected to six Arduino digital output pins(9, 8, 7, 5, 4 and 3). Note that the Arduino output pins 9 and 3 are both PWM-enabled.
Finally, connect one motor to across OUT1 & OUT2 and the other motor across OUT3 & OUT4. You can interchange your motor’s connections, technically, there is no right or wrong way.


