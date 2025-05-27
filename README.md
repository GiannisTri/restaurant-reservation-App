# Restaurant Reservation App

Η εφαρμογή είναι ένα mobile app που επιτρέπει στους χρήστες να κάνουν κρατήσεις σε εστιατόρια εύκολα και γρήγορα, μέσω του κινητού τους τηλεφώνου.


Παρακάτω υπάρχει και ένα βίντεο παρουσίασης της εφαρμογής.

https://www.youtube.com/shorts/DjxAOP3zqZs




Για να λειτουργήσει το app χρειάζεται:

- Να κατεβούν όλα τα dependencies που αναφέρονται στα `package.json` του frontend και backend.
- Να υπάρχει αρχείο `.env` στο backend με τις εξής μεταβλητές:
  
   PORT=
  
   JWT_SECRET=
  
   DB_HOST=
  
   DB_USER=
  
   DB_PASSWORD=
  
   DB_NAME=reservation_app

- Στον φάκελο `screens` του frontend, εκεί που γίνεται η σύνδεση με το backend, πρέπει να προστεθεί η IP του χρήστη (server).
- Η βάση δεδομένων που χρησιμοποιεί η εφαρμογή βρίσκεται μέσα στον φάκελο `backend`.
- Για να τρέξει ο backend server, τρέξε μέσα στον φάκελο `backend` την εντολή:
  
    node index.js

 - Για να τρέξει το frontend, μέσα στον αντίστοιχο φάκελο τρέξε:
 
    npm start


   



----------------------------------------------
  English 
----------------------------------------------






The app is a mobile application that allows users to make restaurant reservations easily and quickly through their mobile phones.


Below, there is also a presentation video of the app.

https://www.youtube.com/shorts/DjxAOP3zqZs


-For the app to work, the following are needed:

-All dependencies listed in the package.json files of the frontend and backend must be installed.

-A .env file must exist in the backend with the following variables:

PORT=

JWT_SECRET=

DB_HOST=

DB_USER=

DB_PASSWORD=

DB_NAME=reservation_app

-In the screens folder of the frontend, where the connection to the backend takes place, the user’s (server) IP must be added.

-The database used by the app is located inside the backend folder.

-To run the backend server, run inside the backend folder the command:


node index.js

-To run the frontend, run inside the respective folder the command:


npm start
