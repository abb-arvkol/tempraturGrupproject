#include <AM2320.h>//Temperaturbibliotek
#include "FirebaseESP8266.h"//firebasebibliotek
#include <ESP8266WiFi.h>//wifi bibliotek
#include <NTPtimeESP.h> //tid bibliotek



#define FIREBASE_HOST "https://temperatur-sensor-spets.firebaseio.com/"
#define FIREBASE_AUTH "Vj3ZQTkksEKL5OAG2CWjccX02ajSo0BRA6pA3lUX"
#define WIFI_SSID "ABB_Indgym_Guest"
#define WIFI_PASSWORD "Welcome2abb"
#define InputPin 13







NTPtime NTPch("ch.pool.ntp.org"); 

FirebaseData firebaseData;
strDateTime dateTime;

String path="/temps";
String nodeID = "tempNode";
bool ButtonState;

AM2320 sensor;//deklarerar en datatyp



void setup()  {//sätter upp parametrar om datorn för resten av koden
  Serial.begin(115200);//datahastighet symboler/sekund
  sensor.begin(14,12); ///SDA,SCL)-(D5,D6)

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

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  
  pinMode(InputPin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  /*if (!Firebase.beginStream(firebaseData, path))
  {
      Serial.println("Could not begin stream");
      Serial.println("REASON: " + firebaseData.errorReason());
      Serial.println();
  }*/
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
String tid;
String tid2;
String wait;

void loop()  {//sätter en loop som repeteras för evigt

  
  ButtonState = digitalRead(InputPin);
  digitalWrite(LED_BUILTIN,true);
dateTime = NTPch.getNTPtime(1.0, 1);
  //Sätter strings för tid
  year=String(dateTime.year);
  month=String(dateTime.month);
  day=String(dateTime.day);
  hour=String(dateTime.hour);
  minute=String(dateTime.minute);
  second=String(dateTime.second);
  intminute=int(dateTime.minute);
  tid=month+"-"+day+"-"+hour+"-"+minute;
  hourtime=hour;//timmvis lagring
  daytime=day;//dagvis lagring
  //dateTime.minute=

  
//livevärde

  if(ButtonState){
     if(Firebase.setDouble(firebaseData, "/live/rum1/temp", (99))){
      Serial.println("HaHaHa");
  }
  }

  else{
    if (sensor.measure()){//kollar om sensorn mäter up något
    Serial.print("Temperature:");//skriver "Temperature"
    Serial.println(sensor.getTemperature());//Lägger ett värde efter texten"Temperature"
    if(Firebase.setDouble(firebaseData, "/live/rum1/temp", sensor.getTemperature())){
      Serial.println(":)");
    } else {
      Serial.println(":(");
    }
    
    
    Serial.print("Humidity:");//Skirver "humidity"
    Serial.println(sensor.getHumidity());// lägger ett värde efter texten"Humidity"
    if(Firebase.setDouble(firebaseData, "/live/rum1/hum", sensor.getHumidity())){
      Serial.println(":)");
    } else {
      Serial.println(":(");
    }
    }

      else {
    int errorCode=sensor.getErrorCode();//om den inte kan läsa temp, kollar efter fel
   switch (errorCode) {
      case 1: Serial.println("ERR: Sensor is offline");break;//skriver en felkod för ingen sensor hittad
      case 2: Serial.println("ERR: CRC Validation failed."); break;//skriver en annan felkod
     }
    }
  }
   year=String(dateTime.year);
  month=String(dateTime.month);
  day=String(dateTime.day);
  hour=String(dateTime.hour);
  minute=String(dateTime.minute);
  second=String(dateTime.second);
 
  tid2=month+"-"+day+"-"+hour+"-"+minute;
  
   
  if(dateTime.valid){
    NTPch.printDateTime(dateTime);

    
   Serial.println(tid);
   Serial.println(tid2);

     if (tid==tid2){
      if(intminute%10==0){//kollar minuten är delbar med 10 för att inte få för många datum i databasen och vi hade ett felvärde på 28minuten som då sollas bort
    if (sensor.measure()){//kollar om sensorn mäter up något
      //firebaseData.pushName(tid);
      Serial.println("NuTid"+tid);
      if(Firebase.setDouble(firebaseData, "/day/rum1/"+hourtime+"/temp", sensor.getTemperature())){
        Serial.println("Temp.Success!");
      } else {
        Serial.println("Temp.Failed!");
      }
    
    
  
      if(Firebase.setDouble(firebaseData, "/day/rum1/"+hourtime+"/hum", sensor.getHumidity())){;
        Serial.println("Hum.Success");
      } else {
        Serial.println("Hum.Failed");
      }
    }
    }
     
     // wait=minute;
      //Serial.println("wait"+wait);

//timmevis värde

      if(intminute%10==0){
       if (sensor.measure()){//kollar om sensorn mäter up något
      //firebaseData.pushName(tid);
      Serial.println("NuTid"+tid);
      if(Firebase.setDouble(firebaseData, "/mon/rum1/"+daytime+"/temp", sensor.getTemperature())){
        Serial.println("Temp2.Success!");
      } else {
        Serial.println("Temp2.Failed!");
      }
    
    
  
      if(Firebase.setDouble(firebaseData, "/mon/rum1/"+daytime+"/hum", sensor.getHumidity())){;
        Serial.println("Hum2.Success");
      } else {
        Serial.println("Hum2.Failed");
      }
      
      
      
    }

    
    
  
  }


  



  
  }
  }
   

  //long term storage
 

  Serial.println("...........................................................................................................................");
  /*if (sensor.measure()){//kollar om sensorn mäter up något
   
    if(Firebase.pushDouble(firebaseData, "/long/rum1/"+tid+"/temp", sensor.getTemperature())){
      Serial.println("Success!");
    } else {
      Serial.println("Failed!");
    }
    
    
  
    if(Firebase.pushDouble(firebaseData, "/long/rum1/"+tid+"/hum", sensor.getHumidity())){
      Serial.println("Success");
    } else {
      Serial.println("Failed");
    }
  }*/
  
  delay(500); //vänta 500ms till nästa gång den kör loopen
}
