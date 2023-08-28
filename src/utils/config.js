const MODE = "prod"; //dev, prod

const config = {
  dev: {
    db: {
      HOST: "localhost",
      USER: "root",
      PASSWORD: "",
      DATABASE: "maia_art",
    },
    mode: "dev",
  },
  prod: {
    db: {
      HOST: "159.65.57.142",
      USER: "maia_remote",
      PASSWORD: "maiA2525",
      DATABASE: "maia_art",
    },
    mode: "prod",
  },
};

const getConfig = () => {
  return config[MODE];
};

module.exports = { getConfig };
