const styles = require('../../styles.scss');
const styles_container = document.createElement('style');
styles_container.innerHTML = styles.toString();
document.head.prepend(styles_container);