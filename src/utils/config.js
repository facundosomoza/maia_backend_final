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
      HOST: "149.50.130.247",
      USER: "maia",
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
