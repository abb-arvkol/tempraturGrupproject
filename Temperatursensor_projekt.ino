#include <AM2320.h>//deklarerar att man vill ha med det biblioteket

AM2320 sensor;//deklarerar en datatyp

void setup()  {//sätter upp parametrar om datorn för resten av koden
  Serial.begin(115200);//datahastighet symboler/sekund
  sensor.begin(14,12); ///SDA,SCL)-(D5,D6)
}

void loop()  {//sätter en loop som repeteras för evigt
  if (sensor.measure()){//kollar om sensorn mäter up något
    Serial.print("Temperature:");//skriver "Temperature"
    Serial.println(sensor.getTemperature());//Lägger ett värde efter texten"Temperature"
    Serial.print("Humidity:");//Skirver "humidity"
    Serial.println(sensor.getHumidity());>// lägger ett värde efter texten"Humidity"
  }

  else {
    int errorCode=sensor.getErrorCode();//om den inte kan läsa temp, kollar efter fel
   switch (errorCode) {
      case 1: Serial.println("ERR: Sensor is offline");break;//skriver en felkod för ingen sensor hittad
      case 2: Serial.println("ERR: CRC Validation failed."); break;//skriver en annan felkod
   }
  }

  delay(500); //vänta 500ms till nästa gång den kör loopen
}