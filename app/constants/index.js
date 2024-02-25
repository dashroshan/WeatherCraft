const cloudclear = require("../assets/icons/cloudclear.png");
const cloudovercast = require("../assets/icons/cloudovercast.png");
const cloudrain = require("../assets/icons/cloudrain.png");
const mist = require("../assets/icons/mist.png");
const snow = require("../assets/icons/snow.png");
const sun = require("../assets/icons/sun.png");
const suncloudmax = require("../assets/icons/suncloudmax.png");
const suncloudrain = require("../assets/icons/suncloudrain.png");
const sunmist = require("../assets/icons/sunmist.png");
const thunderstorm = require("../assets/icons/thunderstorm.png");
const thunderstormrain = require("../assets/icons/thunderstormrain.png");


export const apiKey = "61b8aca594104eeca4c61513242502";

const weatherIcons = {
    113: sun, 116: suncloudmax, 119: cloudclear, 122: cloudclear, 143: cloudovercast, 176: suncloudrain, 179: snow, 182: snow, 185: cloudrain, 200: thunderstorm, 227: mist, 230: mist, 248: cloudovercast, 260: cloudovercast, 263: cloudrain, 266: cloudrain, 281: cloudclear, 284: cloudclear, 293: suncloudrain, 296: cloudrain, 299: suncloudrain, 302: cloudrain, 305: suncloudrain, 308: cloudrain, 311: cloudclear, 314: cloudclear, 317: cloudrain, 320: cloudrain, 323: suncloudmax, 326: cloudclear, 329: suncloudmax, 332: cloudclear, 335: cloudclear, 338: cloudclear, 350: cloudclear, 353: suncloudrain, 356: suncloudrain, 359: thunderstormrain, 362: suncloudrain, 365: suncloudrain, 368: suncloudmax, 371: suncloudmax, 371: suncloudmax, 377: suncloudmax, 386: thunderstorm, 389: thunderstorm, 392: sunmist, 395: thunderstormrain
};

export function getIcon(icon) {
    let code = icon.substring(icon.length - 7, icon.length - 4);
    return weatherIcons[code] || cloudclear;
}