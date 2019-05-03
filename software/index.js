const path = require('path');
const Joi = require('joi');
const express = require('express');
const app = express();

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    return res.sendFile('index.html', {root: path.join(__dirname, './public')});
});

//-------------primerParcial----------------------------------start

function validatePP(obj){
    const schema = {
        T: Joi.number().required(),
        N: Joi.number().required(),
        C: Joi.number().required(),
        R: Joi.number().required(),
        Rm: Joi.number().required(),
        Uk: Joi.number().required()

    }
    return Joi.validate(obj, schema);
}

app.post('/primerParcial', async (req, res) => {
    const { error } = validatePP(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const T = req.body.T;
    const N = req.body.N;
    const C = req.body.C;
    //const X = req.body.X;
    const R = req.body.R;
    const Rm = req.body.Rm;
    const Uk = req.body.Uk;
    //----------
    const x = C / T;
    const Z = N / x - R;
    const n = x * R;
    const Rmem = Rm / x;
    const Dk = Uk / x;
    

    res.render('primerParcial', { T, N, C, R, Uk, Rm, x, Z, n, Rmem, Dk });
});

app.get('/primerParcial', async (req, res) => {
    res.render('primerParcialForm');
});

//-------------primerParcial----------------------------------end

//-------------segundoParcial----------------------------------start

function validateSP(obj){
    const schema = {
        t: Joi.number().required(),
        B_cpu: Joi.number().required(),
        B_fast_disk: Joi.number().required(),
        B_slow_disk: Joi.number().required(),
        C: Joi.number().required(),
        C_fast: Joi.number().required(),
        C_slow: Joi.number().required(),
        z: Joi.number().required()
    }
    return Joi.validate(obj, schema);
}

app.post('/segundoParcial', async (req, res) => {
    //console.log(req.body);
    const { error } = validateSP(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const t = req.body.t;//
    const B_cpu = req.body.B_cpu;//
    const B_fast_disk = req.body.B_fast_disk;//
    const B_slow_disk = req.body.B_slow_disk;//
    const C = req.body.C;//
    const C_fast = req.body.C_fast;//
    const C_slow = req.body.C_slow;//
    const z = req.body.z;//
    //----------
    const D1 = (B_cpu/C);//
    const D3 = (B_fast_disk/C);//
    const D2  = (B_slow_disk/C);//
    const V2 = (C_fast/C);//
    const V3 = (C_slow/C);//
    const S3 = (B_fast_disk/C_fast);//
    const S2 = (B_slow_disk/C_slow);//
   
    const sumVk = V2+V3;
    console.log(sumVk);
    const Dbalanced = sumVk/ ((1/S2) + (1/S3));
    console.log(Dbalanced);
    const newVisits2 = Dbalanced/S3;//
    const newVisits3 = Dbalanced/S2;//

    res.render('segundoParcial', { t, B_cpu, B_fast_disk, B_slow_disk, C, C_fast, C_slow, z, D1, D2, D3, V2, V3, S2, S3, newVisits2, newVisits3 });
});

app.get('/segundoParcial', async (req, res) => {
    res.render('segundoParcialForm');
});

//-------------segundoParcial----------------------------------end

//-------------M/M/s-----FIFO-------------------------start

function validateMMs(obj){
    const schema = {
        s: Joi.number().required(),
        lambda: Joi.number().required(),
        mu: Joi.number().required(),
        t: Joi.number()
    }
    return Joi.validate(obj, schema);
}

app.post('/mms', async (req, res) => {
    const { error } = validateMMs(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const s = req.body.s;//number of servers
    const lambda = req.body.lambda;//arrival rate
    const mu = req.body.mu;//service rate
    const t = req.body.t;//observation time
    //----------
    const p = lambda / mu;//utilization
    const pn = 1 - p;//p n clients and no clients on queue system
    const ls = p / pn;//clients average @ system
    const ws = ls / lambda;//residence average
    const lq = (lambda*lambda)/(mu*(mu-lambda));//average from clients in queue
    const wq = (lq/lambda);
    const l = (ls + lq);//served clients
    const p0 = 1 - p;//p time null @ queue
    const pt = p * Math.exp(-1*mu*(1-p)*t);//p waiting time @ queue
    const pe = Math.exp(-1*mu*(1-p)*t);//p residency time

    res.render('mms', { s, lambda, mu, t, p, pn, ls, ws, lq, wq, l, p0, pt, pe });
});

app.get('/mms', async (req, res) => {
    res.render('mmsform');
});

//-------------M/M/s----------------------------------end

//-------------M/M/1-----FIFO-------------------------start

function validateMM1(obj){
    const schema = {
        lambda: Joi.number().required(),
        mu: Joi.number().required(),
        t: Joi.number()
    }
    return Joi.validate(obj, schema);
}

app.post('/mm1', async (req, res) => {
    const { error } = validateMM1(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const lambda = req.body.lambda;//arrival rate
    const mu = req.body.mu;//service rate
    const t = req.body.t;//observation time
    const p = lambda / mu;//utilization
    const pn = 1 - p;//p n clients and no clients on queue system
    const ls = p / pn;//clients average @ system
    const ws = ls / lambda;//residence average
    const lq = (lambda*lambda)/(mu*(mu-lambda));//average from clients in queue
    const wq = (lq/lambda);
    const l = (ls + lq);//served clients
    const p0 = 1 - p;//p time null @ queue
    const pt = p * Math.exp(-1*mu*(1-p)*t);//p waiting time @ queue
    const pe = Math.exp(-1*mu*(1-p)*t);//p residency time

    res.render('mm1', { lambda, mu, t, p, pn, ls, ws, lq, wq, l, p0, pt, pe });
});

app.get('/mm1', async (req, res) => {
    res.render('mm1form');
});

//-------------M/M/1----------------------------------end

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening with port ${ port }...`));