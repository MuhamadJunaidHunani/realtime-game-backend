
const corsConfig = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  transports: ['websocket', 'polling'], 
};

module.exports = corsConfig;