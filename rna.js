function randomRange(min, max){
    return Math.random() * (max - min) + min
}

function lerp(a, b, t){
    return a + (b - a) * t
}

class Neuron {
    constructor(inputs){
        this.bias = randomRange(-1, 1);

        this.weightList = new Array(inputs)
        .fill()
        .map(() => randomRange(-1, 1));
    };

    g(signalList = []){
        let u = 0;
    
        for (let i = 0; i < this.weightList.length; i++){
            u += signalList[i] * this.weightList[i]
        }
    
        if (Math.tanh(u) > this.bias) return 1;
        else return 0;
    }

    mutate(rate = 1) {
        this.weightList = this.weightList.map(() => {
            return lerp(w, randomRange(-1, 1), rate)
        });
    
        this.bias = lerp(this.bias, randomRange(-1, 1), range)
    }
}

