'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "1b79de62a43f550badeb7fca7753f8b1",
"version.json": "ed1e79f9f34157eeabc0dc1c3e01f5aa",
"index.html": "0c2bedf5539fea8493453efcd20234b8",
"/": "0c2bedf5539fea8493453efcd20234b8",
"main.dart.js": "6eba34e47c8cd61fd789bb354d4517be",
"sqlite3.wasm": "0d26505f2d32b5f49616648fe90b9214",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"drift_worker.js": "c5a6b512b58d81771326f863c83c2f70",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "7ad4dc31df7136051c8f9cf6e242aad4",
"assets/NOTICES": "df90709cf3c29f64ae61407c994296f7",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "76c81eb904c9f79e29680b91ed039cdd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/AssetManifest.bin": "93130b1519d7e9901ba5ada556ddba36",
"assets/fonts/MaterialIcons-Regular.otf": "dba62e6b86aff4921adc26599f04a4e5",
"assets/assets/svg/pl/wyrafinowany.svg": "cfabf4d15ebca6990f7b9c8d1401cdae",
"assets/assets/svg/pl/postawic-na-swoim.svg": "70e9fd12f523f0727f923c89a0b6b46e",
"assets/assets/svg/pl/trafic-w-sedno.svg": "07d20e924189e69db3f44521d88a8c2a",
"assets/assets/svg/pl/rzetelny.svg": "82517f531f651ea16d2c0503d6ad2405",
"assets/assets/svg/pl/drazliwy.svg": "aa16af636e75135afd3d67b5674baef8",
"assets/assets/svg/pl/rzucac-grochem-o-sciane.svg": "dbe5c52ca154f67fa89441d750ca9c49",
"assets/assets/svg/pl/z-calym-szacunkiem.svg": "c2be961529407bd273e2521de67eebe3",
"assets/assets/svg/pl/zlapac-byka-za-rogi.svg": "5141354e1ba0161b66ce033e32fee1c9",
"assets/assets/svg/pl/poblazliwy.svg": "26f30276412996a9d64fa2c137f5bd29",
"assets/assets/svg/pl/malostkowy.svg": "7bf95753ffabf282c5332ed51568ea32",
"assets/assets/svg/pl/w-gruncie-rzeczy.svg": "bca5ca4274142aeb76a807f210c44846",
"assets/assets/svg/pl/miec-weza-w-kieszeni.svg": "fb784b1f04a24dd953cc7ed25f91d81d",
"assets/assets/svg/pl/jak-gdyby-nigdy-nic.svg": "1edc86bfc05788106f940ebc426d0b77",
"assets/assets/svg/pl/dotkliwy.svg": "70167f5e42066fe614d8762a140a4aa5",
"assets/assets/svg/pl/pochopny.svg": "dea9c62ce1965555dd81d511d14c96b4",
"assets/assets/svg/pl/spac-jak-susel.svg": "c0fe3adbd7dca3e8ed9de425c8b6018e",
"assets/assets/svg/pl/truizm.svg": "cff457a7e9b5cba73eed2b68c5670d01",
"assets/assets/svg/pl/musztarda-po-obiedzie.svg": "fdbb9bab5bf7048346f8c8373f85ffbe",
"assets/assets/svg/pl/frazes.svg": "7794780eb8f93eeeb803ba26a38f2f11",
"assets/assets/svg/pl/oszczedny.svg": "f866647d9ae7b3b0a56f10c5810ac80f",
"assets/assets/svg/pl/wywazony.svg": "fb7e20f9750ad2d941c00ee66acb18fb",
"assets/assets/svg/pl/lapidarny.svg": "92c52b40046d6b06bffb2c878b2655fc",
"assets/assets/svg/pl/chowac-glowe-w-piasek.svg": "f1acb64ad800f145a7c2b650fc98301e",
"assets/assets/svg/pl/igrac-z-ogniem.svg": "a60a335cd83e8cecdc17e98ced4fa833",
"assets/assets/svg/pl/chwytac-sie-brzytwy.svg": "1b51f825282c40f4ee646362922ef251",
"assets/assets/svg/pl/roztargniony.svg": "ba835ab140b58bc3efbba46cd49a8b1b",
"assets/assets/svg/pl/urwac-sie-z-choinki.svg": "43faa1d008bf77d46c7e9188a07f2fb4",
"assets/assets/svg/pl/dobitny.svg": "84fb28d119e8a262505a49e54ea0a807",
"assets/assets/svg/pl/kropla-w-morzu-potrzeb.svg": "2ee293c4f6b55814ee5fd430c05beb1d",
"assets/assets/svg/pl/frapujacy.svg": "214bfc28ad758389e6011acbef5165fd",
"assets/assets/svg/pl/rzecz-jasna.svg": "d19a7c457bb74f977ff9fa6614bcb859",
"assets/assets/svg/pl/pryncypialny.svg": "6d417a83be57be36e41ef033d209446f",
"assets/assets/svg/pl/subtelny.svg": "604a485970b603633763fa4b1cdf0227",
"assets/assets/svg/pl/namacalny.svg": "45b2b276c0ed6184c6a81a83272def0f",
"assets/assets/svg/pl/badz-co-badz.svg": "854cdf798f879bc82a87b78d02be4dd8",
"assets/assets/svg/pl/wymowny.svg": "844a985613ecfe5f147414256bb1054f",
"assets/assets/svg/pl/blahy.svg": "7e9f036addcca4115fa8ad70bd471fec",
"assets/assets/svg/pl/dosadny.svg": "283b603b74fe84b05eed0b0140960aa3",
"assets/assets/svg/pl/wyjsc-z-twarza.svg": "242ddeb81cbefe685eba007f2f389fdd",
"assets/assets/svg/pl/miec-rece-pelne-roboty.svg": "bae6c3f1fd25ddfe11178590984260c8",
"assets/assets/svg/pl/mimochodem.svg": "f4e641ecc3a6fe4f8f8f3c6760204a05",
"assets/assets/svg/pl/dolac-oliwy-do-ognia.svg": "2b1fcdbb286762a592130bb21114fdb2",
"assets/assets/svg/pl/asertywny.svg": "d8b587c5a7168052ecab0005059c569e",
"assets/assets/svg/pl/miec-glowe-na-karku.svg": "c095e6620e796a974608d6d39ec27808",
"assets/assets/svg/pl/ulotny.svg": "9fc70b7b71cd018b0faa4be989528062",
"assets/assets/svg/pl/nabrac-wody-w-usta.svg": "a049e29c45381cdee593f32e5c894773",
"assets/assets/svg/pl/nonszalancki.svg": "496ff531a1fa8b1523bcd456b6909465",
"assets/assets/svg/pl/ma-sie-rozumiec.svg": "cd3b4e60db0c35bde964ad4cebfb5cef",
"assets/assets/svg/pl/drobiazgowy.svg": "ec1f67d52d93e7d3385a55595b0d65cb",
"assets/assets/svg/pl/zbic-z-tropu.svg": "4c6eead2a9cf913fb82aafd7bb93778c",
"assets/assets/svg/pl/niuans.svg": "06e9289d95ebb26f5288946af0534ba3",
"assets/assets/svg/pl/koniec-koncow.svg": "30854f544238fc67900fbc1ad1372317",
"assets/assets/svg/pl/przelac-czare-goryczy.svg": "34966d870dcbb1a28b5862c7cca96c6b",
"assets/assets/svg/pl/wygadany.svg": "1b18c06e161b202b121a9dccf011c3d2",
"assets/assets/svg/pl/rzec-by-mozna.svg": "223fdd19f22f967c670dc90c86cc4621",
"assets/assets/svg/pl/innymi-slowy.svg": "80cf660ebb7744e5aad67d8b10ce2c40",
"assets/assets/svg/pl/zwiezly.svg": "4f3d37deb74a1c8b0d001cfe79eb4650",
"assets/assets/svg/pl/swoja-droga.svg": "8a78d14cff7e949d2dd0fe0252c16f42",
"assets/assets/svg/pl/arbitralny.svg": "c044972bdc4f3060e00c90cf38992ec5",
"assets/assets/svg/pl/lakoniczny.svg": "511a4eac67574f85902c7bcbcd1e66e2",
"assets/assets/svg/pl/na-przekor.svg": "7872c1b15ab8c7fd8f97dde877c568f1",
"assets/assets/svg/pl/rzucac-slowa-na-wiatr.svg": "0616772b3202c1766d1e461cea86bbea",
"assets/assets/svg/pl/rzeklbym.svg": "8859e146f8a58e20e72e7c4d264e96b2",
"assets/assets/svg/pl/uparty.svg": "93bbdbd695cb2c4a132007d66f165fa9",
"assets/assets/svg/pl/nachalny.svg": "2d2956c66a32ef0160b6d1e109160625",
"assets/assets/svg/pl/robic-z-igly-widly.svg": "1384e43514d09ad8d01c25cdfd9fc7e4",
"assets/assets/svg/pl/wyrachowany.svg": "7b35378644bc28ae2bff174e567038ec",
"assets/assets/svg/pl/przymykac-oko.svg": "b18d5c0c4a75d9f56c2ba0c68b98c7e5",
"assets/assets/svg/pl/o-ile-mi-wiadomo.svg": "9ec53d63a103f6cf9b3b351d37e9c91a",
"assets/assets/svg/pl/zawily.svg": "bc86adf55fe4a0567b7a32df4a34a573",
"assets/assets/svg/pl/stanowczy.svg": "3bf8094fa702663184ee974ec5302f72",
"assets/assets/svg/pl/osobliwy.svg": "4a39011a711cc3c236d697a22182e632",
"assets/assets/svg/pl/przewrotny.svg": "727c84a42d4791ecda2f7a3e35b98cf4",
"assets/assets/svg/pl/rzucic-sie-w-wir-pracy.svg": "9e8b5db2f5622e7f859c4a7122612d1b",
"assets/assets/svg/pl/przesadny.svg": "7d0ba06a0076712c3eac040384ed3c99",
"assets/assets/svg/pl/wpasc-jak-sliwka-w-kompot.svg": "48b4cfab5441b082a4cc27b6939b624e",
"assets/assets/svg/pl/sumienny.svg": "37e310ce600c58f5b821f5cd8a7eb388",
"assets/assets/svg/pl/rozwazny.svg": "013feb7e0d9d90bebfbce939a2468cd6",
"assets/assets/svg/pl/niezreczny.svg": "383cda5c95547b0d569718abb2245e7b",
"assets/assets/svg/pl/skrupulatny.svg": "8edd5ec4b6ff4e969291ffa38e96808d",
"assets/assets/svg/pl/nawiasem-mowiac.svg": "ed93d86435fadcf14886ef0261be1b58",
"assets/assets/svg/pl/elokwentny.svg": "1fa932171a45a64d5fccaa7d7ce6fa50",
"assets/assets/svg/pl/na-dobra-sprawe.svg": "63a631657b5b5fb6883e1a2f1a9b8969",
"assets/assets/svg/pl/postawic-kropke-nad-i.svg": "f8c6cc415d5333ac097d0bf1043c545f",
"assets/assets/svg/pl/owijac-w-bawelne.svg": "baaeea27af2242aeaf64eb9fddac8636",
"assets/assets/svg/pl/bic-sie-z-myslami.svg": "e99a1af812960b610d25bdf6e70cb602",
"assets/assets/svg/pl/wpasc-w-oko.svg": "8d2a13bd67ce685530b5e11e8f41f308",
"assets/assets/svg/pl/miec-cos-na-koncu-jezyka.svg": "bc45a8f8f357c41b4de855203d76f5e3",
"assets/assets/svg/pl/przekonujacy.svg": "0883ee38f97a9dfff13ce3165f08a57f",
"assets/assets/svg/pl/w-zwiazku-z-tym.svg": "c786c9e685cd2faf9f7b240e5e71a78b",
"assets/assets/svg/pl/dojmujacy.svg": "75e30cc25f42d7f37db03879c80e99f9",
"assets/assets/svg/pl/w-istocie-rzeczy.svg": "d0bd38fe8fe068e9491ab5278d331d60",
"assets/assets/svg/pl/wziac-nogi-za-pas.svg": "fad299153052b28eab964e7a5cb40fc4",
"assets/assets/svg/pl/nieskazitelny.svg": "9b2636853f773c53d422777a362b6239",
"assets/assets/svg/pl/kuriozalny.svg": "e178d28ed494a4de4024a69fbf38aa3f",
"assets/assets/svg/pl/wnikliwy.svg": "f6663f8ddd92b9a00b070fc33b57bbef",
"assets/assets/svg/pl/rzucac-klody-pod-nogi.svg": "2df08534568b660ed31e7dc31ea7a5c9",
"assets/assets/svg/pl/gwoli-scislosci.svg": "5db19190bf8bb47c4b1dea72b4713127",
"assets/assets/svg/pl/co-wiecej.svg": "56f935339c5f1cafd9c60f51267a4060",
"assets/assets/svg/pl/porywczy.svg": "570a2d952c8d7e6671ff0e1e73a7b0bb",
"assets/assets/svg/pl/nieodzowny.svg": "b51e2bcdd10101c9644b11369482a478",
"assets/assets/svg/pl/kwintesencja.svg": "9af71760c9028dd031ab78723fe9dc70",
"assets/assets/svg/pl/dwuznaczny.svg": "1496baf2a395750b6c06b21030fe4192",
"assets/assets/svg/pl/gruntowny.svg": "5d8d8f97edcf32ebef0c6d31972d632f",
"assets/assets/svg/pl/by-nie-rzec.svg": "a07308a07c83771c0356959e743c240e",
"assets/assets/svg/pl/mydlic-oczy.svg": "f0d518c599fb16c8dafb93852c4ee41e",
"assets/assets/svg/pl/isc-po-linii-najmniejszego-oporu.svg": "a0b5ad29ec38b3d1816fb740c0c555fc",
"assets/assets/svg/pl/afektowany.svg": "3c42145f7ffaf0770e61d73e8a2afd4c",
"assets/assets/svg/pl/rzucac-perly-przed-wieprze.svg": "2c2bc8f7b8d1c8e345bed7d408068409",
"assets/assets/svg/pl/wywolac-wilka-z-lasu.svg": "87046175b7e52ff49a09f5b158d49486",
"assets/assets/svg/pl/powsciagliwy.svg": "9f1b110f647ac0651666911ab58ab87e",
"assets/assets/svg/pl/przejsc-do-porzadku-dziennego.svg": "6d526c7dda52adfb5418a31bdcc267c0",
"assets/assets/svg/pl/wyrazisty.svg": "72f31baadd1513f3d26f69d6d0474a83",
"assets/assets/svg/pl/ambiwalencja.svg": "f3dd2bd0b18973d2d570452f27da8c78",
"assets/assets/svg/pl/rzucac-sie-w-oczy.svg": "05a711bf4c301885522470b93c9dab90",
"assets/assets/svg/pl/zdawkowy.svg": "bf191af2741ceb4f726327753f1901fc",
"assets/assets/svg/pl/blyskotliwy.svg": "3f0fb709660fafaccd573220ef2ed9ba",
"assets/assets/svg/pl/byc-w-goracej-wodzie-kapanym.svg": "18eeec776f7613db4abf5ea26205b19f",
"assets/assets/svg/pl/rzeczowy.svg": "e222117940a071655edc947db4230821",
"assets/assets/img/pl/perorowac.webp": "d72c24259167f34256576a2a83d2aee7",
"assets/assets/img/pl/szlochac.webp": "0045a5fc0e4749c761e79e991e09f759",
"assets/assets/img/pl/przemozny.webp": "eea658f175721b9afeb672d7017fa212",
"assets/assets/img/pl/sformulowac-zarzut.webp": "3f8307ce2c3ebcff729e0a1a257cf052",
"assets/assets/img/pl/rozstrzygnac-spor.webp": "855c622b2c41d9bb6727b7bb68d1544f",
"assets/assets/img/pl/insynuowac.webp": "8adf7963cd40e9948821b667e84adf5f",
"assets/assets/img/pl/wyglosic-opinie.webp": "5055db0c6af4e22ea3a819a2fe9efde1",
"assets/assets/img/pl/na-gwalt.webp": "0f4499191cd1a92f2297c8e44826cb36",
"assets/assets/img/pl/zazarta-dyskusja.webp": "f720ef0a1e17ab31e7a2773cc037e8ca",
"assets/assets/img/pl/perswadowac.webp": "e92e515685413464dd7eaf6ba1951aa4",
"assets/assets/img/pl/bagatelizowac.webp": "f63bf45523458bbb010896987305b047",
"assets/assets/img/pl/by-nie-rzec.webp": "d2e2a7533a40eb5f4b80f5e618300fb7",
"assets/assets/img/pl/jalowa-dyskusja.webp": "e25d5ed7585be6385080b642f5b817fd",
"assets/assets/img/pl/rzucac-perly-przed-wieprze.webp": "890f491c4fc31f4c4430a7e841c7c461",
"assets/assets/img/pl/konfabulowac.webp": "9ec72e51306c9b0287e7cb7f4e2380f1",
"assets/assets/img/pl/inwektywa.webp": "df3cc78a56af1aefc352a0cded969ad8",
"assets/assets/img/pl/naklaniac.webp": "1c60882493ffc063ce0ab862635fbd4d",
"assets/assets/img/pl/ile-sil-w-nogach.webp": "e2b024efdeb0795832109e8f61103d35",
"assets/assets/img/pl/konstruktywna-krytyka.webp": "a5b6afd3df3a5657446a23cd0773caa6",
"assets/assets/img/pl/odeprzec-zarzut.webp": "b393f6b089b6f593c7f2fb6e3bef4007",
"assets/assets/img/pl/frasobliwy.webp": "f0fed91fa2f901b3555c7e1a2868aa14",
"assets/assets/img/pl/imputowac.webp": "8d1f4a6efd9c3291297113e3794c7247",
"assets/assets/img/pl/impertynencja.webp": "562fa1b75f64d1498d04b479c2d35e89",
"assets/assets/img/pl/na-leb-na-szyje.webp": "6ce5fec077258b8e2d6c9fc65dba8e06",
"assets/assets/img/pl/indagowac.webp": "cae0242636437d41db3310b2f59ce607",
"assets/assets/img/pl/snuc.webp": "d52e71213dd0509886b2d72bce62b460",
"assets/assets/img/pl/laknac.webp": "143b5d7fe41618ef87018537f30f6c04",
"assets/assets/img/pl/co-kon-wyskoczy.webp": "24a32f510d2782496abb250ffeb28e20",
"assets/assets/img/pl/podniesc-kwestie.webp": "41955828f73a1ba793066369c860bdf6",
"assets/assets/img/pl/riposta.webp": "e351615077546bda20046dfa7679ce54",
"assets/assets/img/pl/na-zlamanie-karku.webp": "5bcbcd3afe7819adb8c87a4c2e8bf50f",
"assets/assets/img/pl/otchlan.webp": "4ce6eb129b02209427b42cd688fbe597",
"assets/assets/img/pl/konstatowac.webp": "ec20429b0547367b0f3945f2ae08ba77",
"assets/assets/img/pl/zajac-stanowisko.webp": "bafa719074d359094e3b391fe66d1d6f",
"assets/assets/img/pl/afektowany.webp": "8f31ec332fb9b908a5d7d4f823703a32",
"assets/assets/img/pl/wszelako.webp": "9a53830e3bfbc75cd04e10de31eaff5c",
"assets/assets/img/pl/zgryzota.webp": "87d7b61244268871b9b20558079f8c28",
"assets/assets/img/pl/na-chybcika.webp": "c0ea215b781f1cbf52710ef45cd8782f",
"assets/assets/img/pl/wyscig-z-czasem.webp": "0c600d3feb07d47603269db50c756397",
"assets/assets/img/pl/upojenie.webp": "4c3b6dee8e016830dfab1080f5bda3be",
"assets/assets/img/pl/obalic-teze.webp": "ad3a75fd38daa42f31a59115fcce2b30",
"assets/assets/img/pl/aluzja.webp": "a19bfbc5bbae75a6e2e64704aa69d36f",
"assets/assets/img/pl/deprecjonowac.webp": "2fc7c8865b51f9aaaa67e87244540a97",
"assets/assets/img/pl/wnikliwa-analiza.webp": "62963ba2a59a5d1fdad16fcc042dde86",
"assets/assets/img/pl/raczyc.webp": "c7a8327f501f2b6e236f0c1db2d11772",
"assets/assets/img/pl/dowiesc-slusznosci.webp": "3fe220073035ecff6cb7422a62c487a8",
"assets/assets/img/pl/wzniosly.webp": "d46249fbdd2268e82a1ba9aa685c7103",
"assets/assets/img/pl/niezbity-dowod.webp": "9880a5e867d180229162cb14610ec19a",
"assets/assets/img/pl/miazdzacy-argument.webp": "5ac859a363224a04518ea71af5abc1cb",
"assets/assets/img/pl/przedstawic-kontrargument.webp": "a7ec11d3164efcf7ee35ec4c1e0c5c0f",
"assets/assets/img/pl/pryncypialny.webp": "fb7716a52a0cf9a5992dee9316185286",
"assets/assets/img/pl/w-te-pedy.webp": "1efb7091c755b7ac758d72b4ae077f9c",
"assets/assets/img/pl/celna-riposta.webp": "34f0d689df30792efd696b7dcf4d733a",
"assets/assets/img/pl/uzasadnic-stanowisko.webp": "8d02516e2b7b7bcb184520915694877c",
"assets/assets/img/pl/majaczyc.webp": "c422265b346456410244c59331e0bce3",
"assets/assets/img/pl/zagaic.webp": "c91b6bc90b178155ca654f9efb7068e6",
"assets/assets/img/pl/ubolewac.webp": "e1ff0985627614e712f0295099954012",
"assets/assets/img/pl/za-piec-dwunasta.webp": "6aa3cb75f81665b3198f12cca012ffae",
"assets/assets/img/pl/obalic-mit.webp": "f69ebc94f2299d8ef4386fa298fd7397",
"assets/assets/img/pl/swada.webp": "8e61dbcf3f2d63ca3ebfe0411fc57118",
"assets/assets/img/pl/dezawuowac.webp": "c9c8ab4ed99e3434b7a929418975b305",
"assets/assets/img/pl/wyprowadzic-wniosek.webp": "1c654d9ae757ec014fd14cb96a5a9593",
"assets/assets/img/pl/spowijac.webp": "221d9d29d9a3a78343161ccf58f754b4",
"assets/assets/img/pl/utyskiwac.webp": "0a65af08327e51734db6ca8b8c717580",
"assets/assets/img/pl/burzliwa-debata.webp": "4c5a44e45627cf3423c73fdb6bb2e8ff",
"assets/assets/img/pl/na-lapu-capu.webp": "1c1d81bf5be18a9a68153587cf0a4fcf",
"assets/assets/img/pl/tyrada.webp": "152938b4b4c211a75ba2819db6a7a9c6",
"assets/assets/img/pl/ferwor.webp": "8dd5e44e2a1e521ac334fc394c39a608",
"assets/assets/img/pl/prowadzic-polemike.webp": "8dcf367eb9d27a1499c612026ab3dd22",
"assets/assets/img/pl/czym-predzej.webp": "85b9facb8461768d26800fd620b20a21",
"assets/assets/img/pl/postawic-teze.webp": "6d4aa6570033256922b3747b4af7c204",
"assets/assets/img/pl/wykazac-sprzecznosc.webp": "908ec33637012fcd5f660098bad5bf94",
"assets/assets/img/pl/rzewny.webp": "94c0f9f6a6752af85c8baeedbe5163d2",
"assets/assets/img/pl/gardzic.webp": "6bfd3feb604a12c8c0d10e415898b6e8",
"assets/assets/img/pl/artykulowac.webp": "a53fb21db933ff2df28e6f1e3a52e45c",
"assets/assets/img/pl/ckliwy.webp": "77ad27d4e12c547efdc08df1974c1fe0",
"assets/assets/img/pl/dygresja.webp": "18d32a4877daf9a250b9bde14f65e9c2",
"assets/assets/img/pl/rzutem-na-tasme.webp": "66c2c27f95bf80eccce50ee95a9468ae",
"assets/assets/img/pl/zacny.webp": "86d59fb34bd52ebf55784f73dec25573",
"assets/assets/img/pl/markotny.webp": "0e41e4b1a28aa019410e7fdcc001cc5b",
"assets/assets/img/pl/spojna-argumentacja.webp": "5ca6a86a4037c5ba66c55f1c6d35cb8d",
"assets/assets/img/pl/zalagodzic-spor.webp": "e8b51c2f597e51ae93bc86c4dde346d2",
"assets/assets/img/pl/niezlomny.webp": "22bc5ae5c9b6e774a1b916432908c7c7",
"assets/assets/img/pl/rozwodzic-sie.webp": "0240e24949ea897a22eeca6804bc8ae8",
"assets/assets/img/pl/luby.webp": "7699e9e12bb66f5fd0254ac38bed10e0",
"assets/assets/img/pl/ripostowac.webp": "9c9372190e336624c730e8a6e1239a07",
"assets/assets/img/pl/bronic-stanowiska.webp": "9b09eb7184428d907b649ace2de78870",
"assets/assets/img/pl/znamienity.webp": "4b252289fa0930bf824ca4495b1cf99a",
"assets/assets/img/pl/finezja.webp": "d038fd307743868b5d6e9cf0efd1a06f",
"assets/assets/img/pl/eteryczny.webp": "5f8b85246ebf7f03ead88bcdd641b6cd",
"assets/assets/img/pl/moralizowac.webp": "6d46a33103fe8005a3a4a907077d01d5",
"assets/assets/img/pl/konkludowac.webp": "2045dc7fbd07f707fd9b2b867487f13d",
"assets/assets/img/pl/niewzruszony.webp": "dccae5bb22755954d1ea725260f3f8f8",
"assets/assets/img/pl/zaiste.webp": "ef81401d184589af304a24738b474782",
"assets/assets/img/pl/roztrzasac.webp": "93202ae4bb35955717160e288a637e08",
"assets/assets/img/pl/splendor.webp": "630a14d942b2c0c40767ea8dd165fd0e",
"assets/assets/img/pl/przytoczyc-argument.webp": "42761a6edc5fe0c8a2add8ad756f1587",
"assets/assets/img/pl/nieprzejednany.webp": "49fd77dd6b618955ba05c4d19eee55d8",
"assets/assets/img/pl/przyjac-zalozenie.webp": "5a759ebae3deea7327e7a8bea4e11516",
"assets/assets/img/pl/prawic.webp": "64f28756f0df335781cb970a0966513f",
"assets/assets/img/pl/eufemizm.webp": "b8073bf250845822f846441380121f57",
"assets/assets/img/pl/lubowac-sie.webp": "bca534da80b958932ad0c43113bba306",
"assets/assets/img/pl/wywolac-polemike.webp": "9de7c7886565a40c2e51d621a8718b9d",
"assets/assets/img/pl/wysnuc-wniosek.webp": "d18064df879d476bc50ad0b3915168f5",
"assets/assets/img/pl/rzeczowa-argumentacja.webp": "0ba7181619001bee2c3e95ec5697c8a3",
"assets/assets/img/pl/oponowac.webp": "3799cc20ba55de837ae47896c39988e3",
"assets/assets/img/pl/polot.webp": "ae5b23edb0c12f7ea8d98bc04af47be9",
"assets/assets/img/pl/jawic-sie.webp": "eaeeaba6820c58c2710fdfaa4921e3e4",
"assets/assets/img/pl/przywolac-przyklad.webp": "524f8717178f33a2800d4fa9744bbda3",
"assets/assets/img/pl/wysunac-zarzut.webp": "6d8ed702eb42d68715719c07f0bb00e5",
"assets/assets/img/pl/napomykac.webp": "e83ef4e361834d86a374900ef038d8ab",
"assets/assets/img/pl/dywagowac.webp": "e9a63339ee63b13d9b453f2dc6a104e1",
"assets/assets/img/pl/snuc-rozwazania.webp": "2b74f5296e7b2d7e00a5e513c6151d50",
"assets/assets/img/pl/pozoga.webp": "47659f58b15129ddabde86fcd8e9eded",
"assets/assets/img/ukr/15.webp": "59d0d375087ed076a2990e4b613fe3d6",
"assets/assets/img/ukr/39.webp": "9e34ba58c03e20e1aa473b21a53e5ead",
"assets/assets/img/ukr/5.webp": "ec0c8a17c22dd53b19ff628514256409",
"assets/assets/img/ukr/19.webp": "12f927b2f3169b3dc9da287d2204236a",
"assets/assets/img/ukr/35.webp": "07cd64a6812f461a8e3c47a37ed11d0f",
"assets/assets/img/ukr/9.webp": "177b9dae88650c921f819e9e14751aa1",
"assets/assets/img/ukr/23.webp": "00672f493664007d8f20460024bce460",
"assets/assets/img/ukr/22.webp": "1bda288657dcbb085249d3be02612eed",
"assets/assets/img/ukr/8.webp": "c139b4ad0358565aa24e334518687985",
"assets/assets/img/ukr/34.webp": "3d53dea68a8c81a47e555546ad1ed883",
"assets/assets/img/ukr/18.webp": "c5e0ecc379fd2e9ae2246ff42b8f452a",
"assets/assets/img/ukr/4.webp": "bfb87b7f11e4b0e0ebf9072a41875c13",
"assets/assets/img/ukr/38.webp": "29294e46e7b3eee73cee086a5e27f233",
"assets/assets/img/ukr/14.webp": "ed373b056aaef45f99500db0690b5e78",
"assets/assets/img/ukr/33.webp": "c381bbfe1b88bb57de4967d07628628d",
"assets/assets/img/ukr/25.webp": "a6db8490d521a90cafa178ad9ec994a3",
"assets/assets/img/ukr/13.webp": "1701ae96b0ae30514e5c1976c2f496d2",
"assets/assets/img/ukr/3.webp": "a8d7594d944a4ddc12da1d4824c42514",
"assets/assets/img/ukr/29.webp": "66d8dd2b8c80963b550d1919e076d00a",
"assets/assets/img/ukr/28.webp": "6f3762b46647bb8811b3bce0c3c9bc59",
"assets/assets/img/ukr/2.webp": "23a41053fba96dc1eb5628c64fe01723",
"assets/assets/img/ukr/12.webp": "5452d1b532a295d835cec4ca0380d5c3",
"assets/assets/img/ukr/24.webp": "111a4ef2c0679f07c5152e234c15a379",
"assets/assets/img/ukr/32.webp": "b66efb8f440e3685ccb07d17d51b353e",
"assets/assets/img/ukr/27.webp": "44f21ac097d56cb653a2910a0ee06285",
"assets/assets/img/ukr/31.webp": "51d88ef1cb4b5c86ca556c3bd1bd5f95",
"assets/assets/img/ukr/1.webp": "1a9e779c64ef86df82cf9f0685ea8fc1",
"assets/assets/img/ukr/11.webp": "83c9900c7cbd583e64348be370600847",
"assets/assets/img/ukr/10.webp": "6d0895f6f6e90efb6709157ca18c045c",
"assets/assets/img/ukr/30.webp": "5f7291fe77a64e8bd0cc661812098b85",
"assets/assets/img/ukr/26.webp": "984c446593417e5d6a182028aa3bca38",
"assets/assets/img/ukr/7.webp": "6482a81e0938200482bb8706c5894862",
"assets/assets/img/ukr/17.webp": "c5858b0ccf771285c2a5b4d50367603a",
"assets/assets/img/ukr/21.webp": "1ee189b5007edfa1d47757edfb7db17b",
"assets/assets/img/ukr/37.webp": "d7402adeaa226d77469aca109b729b67",
"assets/assets/img/ukr/36.webp": "305fae313c4979c8cd110363f0ce230d",
"assets/assets/img/ukr/20.webp": "548e5e808caaab6947a54a6a76424671",
"assets/assets/img/ukr/16.webp": "f02ffbb874b916e941d9e100e7f35c4d",
"assets/assets/img/ukr/6.webp": "7976d29b3af3a660659c9a3fa3dd7620",
"assets/assets/img/en/weeded-out.webp": "ed52c1ddc65707905857d4123f28f4e4",
"assets/assets/img/en/rubber-toy.webp": "f840beacdf1f0c070972fe4d0597b339",
"assets/assets/img/en/whim.webp": "022565e2e650fbd1de79f1518a01614a",
"assets/assets/img/en/mystified.webp": "4ad3d8ce6f19dce880ddfcee3bba361f",
"assets/assets/img/en/nightclub-bouncer.webp": "4b5317e4d90d0aeff0f09fb8386c65bc",
"assets/assets/img/en/in-undergrad.webp": "d4d920e5ce6a40da35ec1694e7d9e5d2",
"assets/assets/img/en/lecturer.webp": "82219a529e25f4dff2e6054c1043557c",
"assets/assets/img/en/docile.webp": "260c8e6c55edb9d837ca86a54b337506",
"assets/assets/img/en/habituate.webp": "ab525e3dcd6fdba36e597ae861edcadb",
"assets/assets/img/en/stripes.webp": "472069c99c2e7bb596b657aec3448693",
"assets/assets/img/en/inflict.webp": "b185530e7f8c15318af97fd92598ceb6",
"assets/assets/img/en/encompass-the-bulk-of.webp": "7baa0a31a9a5b6bfd3ca98b38d4502c5",
"assets/assets/img/en/op-ed.webp": "001669c3bd1c30f342556d33386e6367",
"assets/assets/img/en/gauche.webp": "41271aeec1da29e7abe61acf700c96f0",
"assets/assets/img/en/totem-pole.webp": "a752e06a771aeb5f91367b77d088d53c",
"assets/assets/img/en/withhold-grooming.webp": "a952f5b95a91a0070b11f0596642fb94",
"assets/assets/img/en/prominent.webp": "0da275a756d18aff521f9da9fbc8a3d6",
"assets/assets/img/en/maladaptive.webp": "01a2d94dc39a3e98c9e74a01a26fe1b6",
"assets/assets/img/en/wields.webp": "5c4744ddee8d4a187b379f375e49047b",
"assets/assets/img/en/selective-copiers.webp": "787f215737b962fb47ea29f5b87fa045",
"assets/assets/img/en/folk.webp": "4e4c7b27070da73b0172a9a8ed702b26",
"assets/assets/img/en/incentive.webp": "65e40f79228f51544de8ece68c7e53ca",
"assets/assets/img/en/tenure.webp": "b023fd2eb1ff7210de0bb8efb4dc7567",
"assets/assets/img/en/non-tenured.webp": "a294a7893d1805151c4b04c706882f57",
"assets/assets/img/en/domineering.webp": "074de08079df460ec3bfd9eaf50af51d",
"assets/assets/img/en/amazed.webp": "ef88eee4419e6f607f334085b9e6aa1d",
"assets/assets/img/en/conflate.webp": "906eb81ee28d67426d725c05c4f7fdf0",
"assets/assets/img/en/overt-bid-for-status.webp": "eb48c9aee7bb5237ccb5cde355cfc5e9",
"assets/assets/img/en/subjugated.webp": "847a75e676bba02f259ab2c652928a53",
"assets/assets/img/en/jubilation.webp": "055b52c00da1f719468d98dd747d7bce",
"assets/assets/img/en/bolster.webp": "f6777ccdb144719dc26c659b566bf244",
"assets/assets/img/en/unfailingly.webp": "c2a1c2c706ab2181918692763888738d",
"assets/assets/img/en/thwarting.webp": "30a2e730f5de25a0d8c923af5c381bbe",
"assets/assets/img/en/dense.webp": "21a9d3fe37dd9b6db8da20d29050a1b4",
"assets/assets/img/en/bargain.webp": "b0da9a78adfdb6dc430de34edd630987",
"assets/assets/img/en/prevails.webp": "6b7645a3e9f91f70d13b884bf8593930",
"assets/assets/img/en/induce.webp": "c9269ecb2bab613a5e20632585fa2fb9",
"assets/assets/img/en/dwindle.webp": "b220ceb4f52297cf8591aaa96e935a3f",
"assets/assets/img/en/pliant.webp": "7ac1e37709125114cae10d1aa228a0e9",
"assets/assets/img/en/fairness.webp": "70d51fa27089fa61749c0712414679bd",
"assets/assets/img/en/stung.webp": "11230ba4237428e943e4f47825fda451",
"assets/assets/img/en/headman.webp": "31f5d68d73cc289f1256666ab7f7ef55",
"assets/assets/img/en/confer.webp": "42694aa0ed3d87b61a2c66c9d53b07ba",
"assets/assets/img/en/seldom.webp": "67273ce2abe350e167d46568078ae450",
"assets/assets/img/en/tenure-track-offer.webp": "65d8d3f57e3ddf5e0aaa7c453e61b916",
"assets/assets/img/en/ferocity.webp": "84c3ee63a6c329d2ab3e23c018f4cf97",
"assets/assets/img/en/prominence.webp": "c56577bd57cda42ef7833455d6f29c76",
"assets/assets/img/en/overlap.webp": "14a6d4133c9fd5f69d4a1e25280e5fc7",
"assets/assets/img/en/conceal-food.webp": "8e0f4d71ad945ee15cbfefcc1283f51a",
"assets/assets/img/en/perennial.webp": "c408fc99fb5586aa66880ef06cbe4055",
"assets/assets/img/en/incurring.webp": "647b07405b08aa0ec6030c5957e35393",
"assets/assets/img/en/confer-benefits.webp": "c9ed302c018ca16d082ed762d91077cc",
"assets/assets/img/en/instill.webp": "c2961643aad63444501b3203d3e82919",
"assets/assets/img/en/subordinates.webp": "8aeb757683c01204c3570ba0e180dfa0",
"assets/assets/img/en/floating-in-midair.webp": "09271e6214508f49150b92c0355672fc",
"assets/assets/img/en/peck.webp": "ea34a3f7af35877ee9a790d384ce81ad",
"assets/assets/img/en/tightrope.webp": "d592eedc75a0f3c9d39c24ffbfa4061a",
"assets/assets/img/en/connotation.webp": "699f5b671f0937452bff3d7febc7bf38",
"assets/assets/img/en/inculcated.webp": "052f369be05f6e8f08774e7d07674db0",
"assets/assets/img/en/gorged.webp": "8584af4edb0c4b924b7bd4c9b367fb74",
"assets/assets/img/en/foster-homes.webp": "897b182e99d9bc00acfe7192a4c41c1c",
"assets/assets/img/en/bloodshed.webp": "6f24c974dd0c0947fa0d79990fed0b6c",
"assets/assets/img/en/communal.webp": "a5eb35246c7aca71661c9a79356ba93d",
"assets/assets/img/en/crave.webp": "b6290d167c323c5f5fe56633ac8b6644",
"assets/assets/img/en/at-peak-fertility.webp": "d92ee3af763be0d19026d6695acd5e89",
"assets/assets/img/en/at-the-expense-of.webp": "c96f97c6799fd38795142c26d41a5520",
"assets/assets/img/en/callousness.webp": "2d097cdde8173c299f71577224ba907a",
"assets/assets/img/en/forego.webp": "0095fdb0e0403069a7ea059f3c958310",
"assets/assets/img/en/downplay.webp": "3ffd27c251b3e0751a3e97cc7d9b6d6b",
"assets/assets/img/en/cutting-edge.webp": "1a965c9b3e2ccdf7d14f02f0109d793f",
"assets/assets/img/en/landmark.webp": "7c92397838a860d5fa19cfb03f4b315e",
"assets/assets/img/en/precarious.webp": "085eaf62b49aa1a0d24ca823763530d5",
"assets/assets/img/en/blob.webp": "ab19b4c0aae493e5f78f030d4c5cb1c3",
"assets/assets/img/en/apex.webp": "ab404c965134daac77dec8a9cd93a088",
"assets/assets/img/en/dubbed.webp": "ba456e48f124e49fa8876403ea727458",
"assets/assets/img/en/bereft.webp": "57527bb0b710bbe9ebdad0f102d2e84b",
"assets/assets/img/en/fidelity.webp": "036e5c6a4ba2710684cb6aa7659cd1c5",
"assets/assets/img/en/evade.webp": "37392299c4584bfc6316b1873a66d2e6",
"assets/assets/img/en/disfigurement.webp": "9d0b0d927711b340522a155f97858baa",
"assets/assets/img/en/pronounced.webp": "83548035146a9597b84268700cc1b850",
"assets/assets/img/en/be-all-and-end-all.webp": "135406839663521adf134468679e5564",
"assets/assets/img/en/rudimentary.webp": "abefd1f5981d236fa06d08bf3efcc65b",
"assets/assets/img/en/wheat-farm.webp": "8fa2e6f871a5cb5004602b15edc424d3",
"assets/assets/img/en/trait.webp": "a1e8305663cda6c0a6e9732d32a4f988",
"assets/assets/img/en/intrinsic.webp": "9d0b825dd2d3ff24d7d01bf701b2c5f0",
"assets/assets/img/en/sadden.webp": "d8fa2dd0bd02bfc98a7d979785bb81c7",
"assets/assets/img/en/lingers-for-a-while.webp": "2e3b180d7db83b5c2dfc314b679a1a52",
"assets/assets/img/en/ancestral.webp": "31c0182d5d5ce0b19a72d4d3c382bf85",
"assets/assets/img/en/aperture.webp": "db6aa6a6e60f87830940f01b6fb5eda5",
"assets/assets/img/en/relinquish-cooperation.webp": "564ec3a91c6c25e456f114d0f5a290b5",
"assets/assets/img/en/pretentious.webp": "d53d69b76786062d3aa7c3676f4e5d06",
"assets/assets/img/en/self-effacement.webp": "af1f3904dd4bd3d3743cfcb045a87497",
"assets/assets/img/en/carry-out.webp": "db3878321c21f2f07168374450f262c6",
"assets/assets/img/en/undergirds.webp": "1340eb083982099189f312372a512943",
"assets/assets/img/en/enlisted.webp": "2170f32db973c26db1a5b279f9f2d6c5",
"assets/assets/img/en/affiliated.webp": "e2008dbecbc6a38b934e77486e0e5278",
"assets/assets/img/en/counterfeit.webp": "29c5fd71d27f6861a5800e3afe9b4134",
"assets/assets/img/en/belittle.webp": "a8fa3aa2daac9c5cab5868d7be9e9435",
"assets/assets/img/en/beehive.webp": "6e72586677711c07dbc8cd257a10f03e",
"assets/assets/img/en/proliferate.webp": "db21b55178e165f978e6879144963723",
"assets/assets/img/en/airman.webp": "5d4407076fc734293e04eb8aa6918604",
"assets/assets/img/en/hatred.webp": "a40a282cb31a7d7b216e69f283f0a343",
"assets/assets/img/en/adulation.webp": "28dd55e30b5bb48de990e2ffcbe55c17",
"assets/assets/img/en/innate.webp": "ba994b199cc25a28a808a3b994731437",
"assets/assets/img/en/lump-of-dough.webp": "f858ded089d840eeb621ca9d29410d29",
"assets/assets/img/en/goofball.webp": "9752aedbbf900682f12f20adffdc28da",
"assets/assets/words_pl.json": "acbf9c944be93b72b40cf029cb6e458f",
"assets/assets/words_en.json": "59d884158e5450b5f1f62ac527c6b309",
"assets/assets/words_ukr.json": "1449d59e8aeee6bc09ba48ac46fb3f58",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
