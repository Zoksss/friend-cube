<div id="top"></div>


<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Zoksss/friend-cube">
    <img src="/public/assets/friendcube-logo-transparent2.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Friend Cube</h3>

  <p align="center">
    Multiplayer Rubik's cube timer
    <br />
    <a href="https://friend-cube.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/Zoksss/friend-cube/issues">Report Bug</a>
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://friend-cube.herokuapp.com/)


Friend Cube is multiplayer times for solving Rubik's cubes. 

Since there was no proper timer for multiple people solving, I decided to make one myself. The idea came to my mind a few mounts ago, so I decided to design it for fun and practice. I ended up designing it and then coding the front-end part of the timer. I implemented timer logic, but since there was no backend, there was no multiplayer functionality which I intended. I wanted to write the backend for the project but I didn't know how, since I had never done the backend before. I learned a bit about the node and made a fairly simple backend with Node and SocketIO. 
After some time polishing the project, I can call it done, to the point where it functions as intended, but it's still not 100% done.


Friend Cube has all the necessary features including:
* All players have times, averages, and other info from other players in the room.
* All players have the same randomly generated scramble.
* Customizable User Interface
* It's responsive and works on all devices. 


### Built With

*Front End*

* [HTML5](#)
* [SASS](https://sass-lang.com/)
* [JS](#)

*Back End*

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Socket.io](https://socket.io/)


<!-- USAGE EXAMPLES -->
## Usage

If you are a cuber, most of the stuff will be self explanetory, but I still made a how to use guide, which is on website, on this link: 

https://friend-cube.herokuapp.com/help.html

*Note: Help only works on larger screens.




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/Zoksss/friend-cube/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/Zoksss/friend-cube/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: /public/assets/readme-project-ss.png
