
const corsConfig = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  transports: ['websocket', 'polling'], 
};

module.exports = corsConfig;