import express from 'express';
import cors from 'cors';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  })
)
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    app: "enj API"
  })
});


export default app;
