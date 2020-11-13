#include <AM2320.h>//Temperaturbibliotek
#include "FirebaseESP8266.h"//firebasebibliotek
#include <ESP8266WiFi.h>//wifi bibliotek
#include <NTPtimeESP.h> //tid bibliotek
#include <SH1106Wire.h> //skärm bibliotek


#define FIREBASE_HOST "https://temperatur-sensor-spets.firebaseio.com/"
#define FIREBASE_AUTH "Vj3ZQTkksEKL5OAG2CWjccX02ajSo0BRA6pA3lUX"
#define WIFI_SSID "ABB_Indgym_Guest"
#define WIFI_PASSWORD "Welcome2abb"
#define InputPin 13


SH1106Wire display (0x3c, 14, 12, GEOMETRY_128_64, I2C_ONE, 100000);//ställer in olika saker för skärmen och frmförallt ställer så uppdateringshastigheten matchar med temperatursensorn så att de fungerar samtidigt


NTPtime NTPch("ch.pool.ntp.org");

FirebaseData firebaseData;
strDateTime dateTime;

String path = "/temps";
String nodeID = "tempNode";
bool ButtonState;

AM2320 sensor;//deklarerar en datatyp



void setup()  {//sätter upp parametrar om datorn för resten av koden
  Serial.begin(115200);//datahastighet symboler/sekund
  sensor.begin(14, 12); ///SDA,SCL)-(D5,D6)


  //wifi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  //Serial.print("Connecting to Wi-fi");

  while (WiFi.status() != WL_CONNECTED) {
    //Serial.print(".");
    delay(300);
  }

  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  //firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);


  //knapp och led
  pinMode(InputPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  //skärm
  display.init();
  display.flipScreenVertically();
  display.setFont(ArialMT_Plain_10);

} 

String year;
String month;
String day;
String hour;
String minute;
String second;

String hourtime;
String daytime;
int intminute;


String screenTime;
String screenTemp;
String screenHum;
String sTemp;
String sHum;





void loop()  {//sätter en loop som repeteras för evigt

  ButtonState = digitalRead(InputPin);
  digitalWrite(LED_BUILTIN, true);//ser till att led är av
  
  
  //Variablar för tid
  dateTime = NTPch.getNTPtime(1.0, 1);  //för att från biblioteket säkerhetskolla tid
  year = String(dateTime.year);
  month = String(dateTime.month);
  day = String(dateTime.day);
  hour = String(dateTime.hour);
  minute = String(dateTime.minute);
  second = String(dateTime.second);
  intminute = int(dateTime.minute);//kan köras matte på
  hourtime = hour; //timmvis lagring
  daytime = day; //dagvis lagring

//variablar för skärm
  sensor.measure();
  sTemp = String(sensor.getTemperature());
  sHum = String(sensor.getHumidity());
  screenTemp = String(sTemp + "°C");
  screenHum = String(sHum + "%");
  
  if(dateTime.valid){//uppdaterar inte tiden om det är en inkorrekt tid
  screenTime = String(hour + ":" + minute);
    Serial.println("VALID TIME");
  }
  else{
    Serial.println("INVALID TIME");
    }
  
  


//livevärde

  //lite kul easter-egg
  if (ButtonState) { 
    if (Firebase.setDouble(firebaseData, "/live/rum1/temp", (99))) {
      Serial.println("HaHaHa");
    }
  }
//faktiska livevärdets kod
  else {
    if (sensor.measure()) { //kollar om sensorn mäter up något
      Serial.print("Temperature:");//skriver "Temperature"
      Serial.println(sensor.getTemperature());//Lägger ett värde efter texten"Temperature"
      if (Firebase.setDouble(firebaseData, "/live/rum1/temp", sensor.getTemperature())) {//skickar live tid till firebase
        Serial.println("Temp.live.sucsess");
      } else {
        Serial.println("Temp.live.failed");
      }


      Serial.print("Humidity:");//Skirver "humidity"
      Serial.println(sensor.getHumidity());// lägger ett värde efter texten"Humidity"
      if (Firebase.setDouble(firebaseData, "/live/rum1/hum", sensor.getHumidity())) {
        Serial.println("Hum.live.sucsess");
      } else {
        Serial.println("Hum.live.failed");
      }
    }

    else {
      int errorCode = sensor.getErrorCode(); //om den inte kan läsa temp, kollar efter fel
      switch (errorCode) {
        case 1: Serial.println("ERR: Sensor is offline"); break; //skriver en felkod för ingen sensor hittad
        case 2: Serial.println("ERR: CRC Validation failed."); break;//skriver en annan felkod
      }
    }
  }

  if (dateTime.valid) {//kollar att tiden är en korrekt tid
    NTPch.printDateTime(dateTime);


      if (intminute % 10 == 0) { //kollar minuten är delbar med 10 för att inte få för många datum i databasen och vi hade ett felvärde på 28minuten som då sollas bort
        if (sensor.measure()) { //kollar om sensorn mäter up något
          if (Firebase.setDouble(firebaseData, "/day/rum1/" + hourtime + "/temp", sensor.getTemperature())) {//gägger under tid, skapar rätt tid i firebase när det uppdateras, finns tiden redan byts den ut
            Serial.println("Temp.Success!");
          } else {
            Serial.println("Temp.Failed!");
          }



          if (Firebase.setDouble(firebaseData, "/day/rum1/" + hourtime + "/hum", sensor.getHumidity())) {
            ;
            Serial.println("Hum.Success");
          } else {
            Serial.println("Hum.Failed");
          }
        }
      }

   
      //timmevis värde

      if (intminute % 10 == 0) {
        if (sensor.measure()) { 
         
          if (Firebase.setDouble(firebaseData, "/mon/rum1/" + daytime + "/temp", sensor.getTemperature())) {
            Serial.println("Temp2.Success!");
          } else {
            Serial.println("Temp2.Failed!");
          }
          if (Firebase.setDouble(firebaseData, "/mon/rum1/" + daytime + "/hum", sensor.getHumidity())) {
            ;
            Serial.println("Hum2.Success");
          } else {
            Serial.println("Hum2.Failed");
          }
        }
      }
    }

 //visa tid, temperatur och luftfuktighet på skärmen  
  if (ButtonState) {
    display.clear();
    display.setTextAlignment(TEXT_ALIGN_LEFT);
    display.setFont(ArialMT_Plain_24);
    display.drawString(0, 0, screenTime);
    display.setFont(ArialMT_Plain_16);
    display.drawString(0, 24, screenTemp);
    display.drawString(0, 40, screenHum);

    Serial.println(screenTime);
    Serial.println(screenTemp);
    Serial.println(screenHum);

    display.display();//uppdatera skärmen med ändringarna jag gjort
  }
  else {
    Serial.println("Press button!");
    display.clear();
    display.display();
  }

  Serial.println("...........................................................................................................................");//markera en loop klar
 
  delay(500); //vänta 500ms till nästa gång den kör loopen
}
