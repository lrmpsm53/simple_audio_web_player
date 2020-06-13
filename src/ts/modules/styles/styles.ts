const styles = require('./styles.sass');
const styles_container = document.createElement('style');
styles_container.innerHTML = styles.toString();
document.head.prepend(styles_container);