# cast-media
Node.js application to play local files on chromecast devices

## Install

Install from repo:

    $ git clone git@github.com:robmcelhinney/cast-media.git
    $ cd cast-media
A.

    $ cd server
    $ npm install
B.

    $ cd client
    $ npm install

## Usage
Must be on same WiFi.

    $ cd server
    $ npm start


Manual

	$ node bin
 
Call other path

	$ node bin --path=/path/to/share


## Record audio on mobile

The media api requires a HTTPS connection to allow audio recording. You can use OpenSSL to create a key/cert pair and place them a root https directory.
Then use the `https` branch which has uses that key/cert pair.
Easy tutorial: https://www.youtube.com/watch?v=r6gA1NCfvYA
