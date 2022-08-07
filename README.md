
# User system
This is a project is Back-end of simple users CRUD with different rule

### Prerequisites

You should have  `npm` installed. 

### Installing
1. Download the zipped file and unzip it or Clone it
	```sh
	git clone https://github.com/SarahAbdeldaym/ProCrew_Backend.git
	```
2. cd inside the project
    ```sh
    cd ProCrew_Backend
    ```
3.  Run this command to download npm packages
    ```sh
    npm install
    ```
4. Create a copy of your .env file
    ```sh
    cp .env.example .env
    ```

1. Create an empty database for our application in your DBMS
2. In the .env file, add database information to allow AdonisJS to connect to the database
3. Migrate the database
    ```sh
    node ace migration:run
    ```
4.  Seed the database
    ```sh
    node ace db:seed
    ```
5. create admin 
    ```sh
    node ace admin
    ```

6.  Open up the server
     ```sh
      npm run dev
    ```

7.  Open your browser on this url [http://localhost:3333](http://localhost:3333)

