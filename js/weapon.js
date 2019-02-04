
var Weapon = {

  // Instance of Weapon Items
  hand: undefined,
  axe: undefined,
  bow: undefined,
  colt: undefined,
  plasmaGun: undefined,

  // Initializes weapons into objects
  initWeapon: function(name, img, distance, damages, positionX, positionY){
    this.name = name;
    this.img = img;
    this.distance = distance;
    this.damages = damages;
    this.positionX = positionX;
    this.positionY = positionY;
    this.weaponImgGen();
  },

  // Sets the image of a weapon as an html object
  weaponImgGen: function(){
    var weaponImg = new Image();
    weaponImg.src = 'img/' + this.img;
    this.img = weaponImg;
  },

  // Create and place weapons on the map
  weaponSpawn: function(){

    // Default weapon not placed on the ground
    Weapon.hand = Object.create(Weapon);
    Weapon.hand.initWeapon('American fist', 'hand.png', '1', '10', '0', '0');

    var myAxeCoords = Helpers.generateCoords();
    myAxeCoords = myAxeCoords.split(';');
    Weapon.axe = Object.create(Weapon);
    Weapon.axe.initWeapon('Axe', 'axe.png', '1', '15', myAxeCoords[0], myAxeCoords[1]);

    var myBowCoords = Helpers.generateCoords();
    myBowCoords = myBowCoords.split(';');
    Weapon.bow = Object.create(Weapon);
    Weapon.bow.initWeapon('Bow', 'bow.png', '5', '20', myBowCoords[0], myBowCoords[1]);

    var myColtCoords = Helpers.generateCoords();
    myColtCoords = myColtCoords.split(';');
    Weapon.colt = Object.create(Weapon);
    Weapon.colt.initWeapon('Colt', 'colt.png', '8', '25', myColtCoords[0], myColtCoords[1]);

    var myPlasmaGunCoords = Helpers.generateCoords();
    myPlasmaGunCoords = myPlasmaGunCoords.split(';');
    Weapon.plasmaGun = Object.create(Weapon);
    Weapon.plasmaGun.initWeapon('PlasmaGun', 'plasmaGun.png', '15', '30', myPlasmaGunCoords[0], myPlasmaGunCoords[1]);
  }
}
