# Simple Audio Web  Player

Simple player for your site

[Look](https://github.com/{DmitriyOrlov53}/{simple_audio_web_player}/raw/{master}/image.png)

## Version
**0.6.0** . Recommended for reference only. Stay tuned

## Getting Started
### Installing

```
npm installl simple-audio-web-player (not yet available)
```
### Using
#### Description of using

The wrapper function takes two arguments: a collection of elements that will become players, and a playlist as an array of objects
#### Browser

```html
<html>
	<head>
		<script src="./player.js"></script>
	</head>
	<body>
		<div class="container"></div>
		<script>
			const playlist = [
	        	{
	            	name: 'We are the champions',
	            	source: './audio/audio1.mp3'
	        	},
	        	{
	            	name: 'I Want To Break Free',
	            	source: './audio/audio2.mp3'
	        	}
	    	];
	    	
	        Player (
	            document.getElementsByClassName('container'),
	            playlist
	        )
        </script>
    </body>
</html>
```
#### NodeJS

```js
const Player = require('simple-audio-web-player');

const playlist = [
    {
        name: 'We Are The Champions',
        source: '../assets/audio/audio1.mp3'
    },
    {
        name: 'I Want To Break Free',
        source: '../assets/audio/audio2.mp3'
    }
];

Player (
    document.getElementsByClassName('container'),
    playlist
)
```

## Decription
This script (40.8 kb) will generate an audio player on your web page. The package includes icons and css.

**Internet explorer 11 is unsupported**

Icons taken from the site https://remixicon.com/.

The font is an open font from https://fonts.google.com/.

## Error or wish?
Write to me in the mail orlov.dmitriy2303@outlook.com
## Author
Dmitry Orlov, student and novice web developer


## License

This project is licensed under the MIT License