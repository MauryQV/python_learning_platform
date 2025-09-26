import express from 'express';
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.get('/test', (req, res) => {
    res.send('HOLA MUNDO DESDE MI SERVIDOR HUMILDE EN EXPRESSSSSSSSSSSSSSSSSS');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})