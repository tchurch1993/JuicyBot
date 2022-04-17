const fetch = require("node-fetch");

module.exports = class haloApi {
  constructor(apiKey, dev = false) {
    this.apiKey = apiKey;
    if (dev) {
      this.apiUrl = "https://stoplight.io/mocks/halodotapi/cryptum/19534548/";
    } else {
      this.apiUrl = "https://cryptum.halodotapi.com/";
    }
  }

  async getPlayerStats(player) {
    return new Promise((resolve, reject) => {
      fetch(
        this.apiUrl +
          "games/hi/stats/players/" +
          player +
          "/service-record/global",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cryptum-API-Version": "2.3-alpha",
            Authorization: "Cryptum-Token " + this.apiKey,
          },
        }
      ).then((response) => {
        response.json().then((data) => {
          this.getPlayerInfo(player).then((playerInfo) => {
            data.playerinfo = playerInfo.data;
            resolve(data);
          });
        });
      });
    });
  }

  async getPlayerInfo(player) {
    return new Promise((resolve, reject) => {
      fetch(this.apiUrl + "games/hi/appearance/players/" + player, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cryptum-API-Version": "2.3-alpha",
          Authorization: "Cryptum-Token " + this.apiKey,
        },
      }).then((response) => {
        response.json().then((data) => {
          resolve(data);
        });
      });
    });
  }

  /**
   * {
  "data": {
    "service_tag": "ZENY",
    "emblem_url": "https://cryptum.halodotapi.com/games/hi/appearance/images/emblems/104-001-classics-one-782a8d66.png",
    "backdrop_image_url": "https://cryptum.halodotapi.com/games/hi/appearance/images/backdrops/103-000-ui-background-e86f6dee.png"
  },
  "additional": {
    "gamertag": "Zeny IC"
  }
}
   */
};

/**
 * {
    "data": {
        "summary": {
            "kills": 2750,
            "deaths": 1903,
            "assists": 982,
            "betrayals": 0,
            "suicides": 3,
            "vehicles": {
                "destroys": 0,
                "hijacks": 0
            },
            "medals": 1069
        },
        "damage": {
            "taken": 602686,
            "dealt": 751337,
            "average": 5525
        },
        "shots": {
            "fired": 64556,
            "landed": 38674,
            "missed": 25882,
            "accuracy": 59.907677055579654
        },
        "breakdowns": {
            "kills": {
                "melee": 319,
                "grenades": 75,
                "headshots": 2128,
                "power_weapons": 113
            },
            "assists": {
                "emp": 0,
                "driver": 0,
                "callouts": 0
            },
            "matches": {
                "wins": 83,
                "losses": 42,
                "left": 9,
                "draws": 2
            }
        },
        "kda": 8.63480392156863,
        "kdr": 1.4450867052023122,
        "total_score": 349795,
        "matches_played": 136,
        "time_played": {
            "seconds": 89354,
            "human": "1d 00h 49m 14s"
        },
        "win_rate": 61.029411764705884
    },
    "additional": {
        "gamertag": "Falcated"
    }
}
 */
