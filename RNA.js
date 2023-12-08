// função geradora de um número aleatório entre min e max
function randomRange(min, max){
    return Math.random() * (max - min) + min
}

//função de interpolação linear: encontrar um valor entre dois números conhecidos
// nesta função em específico, o valor intermediário é entre a e b, com base no fator t
function lerp(a, b, t){
    return a + (b - a) * t
}

// cria um único neurônio
class Neuron {
    constructor(inputs){
        // inicia o neurônio com um bias aleatório no intervalo entre -1 e 1
        this.bias = randomRange(-1, 1);
        
        // inicializa uma lista de pesos com valores aleatórios no intervalo [-1, 1]
        this.weightList = new Array(inputs)
            .fill()
            .map(() => randomRange(-1, 1));
    };

    // função de ativação: calcula a saída do neurônio
    g(signalList = []){
        let u = 0;
        
        //cálculo da soma ponderada dos sinais de entrada multiplicados pelos pesos
        for (let i = 0; i < this.weightList.length; i++){
            u += signalList[i] * this.weightList[i]
        }
        
        // verifica se o neurônio está ativado
        if (Math.tanh(u) > this.bias) return 1;
        else return 0;
    }

    // Função de mutação nos pesos e bias do neurônio
    mutate(rate = 1) {
        this.weightList = this.weightList.map((w) => {
            return lerp(w, randomRange(-1, 1), rate)
        });
    
        this.bias = lerp(this.bias, randomRange(-1, 1), rate)
    }
}

// Criação da Rede Neural Artificial (conjunto de neurônios)
class RNA{
    constructor(inputCount = 1, levelList = []) {
        this.score = 0;

        // Cria camadas de neurônios com base nas especificações
        this.levelList = levelList.map((l, i) => {
            const inputSize = i === 0 ? inputCount : levelList[i - 1]

            return new Array(l).fill().map(() => new Neuron(inputSize))
        })
    }

    // Cálculo da saída da RNA com base nos sinais de entrada
    compute(list = []){
        for (let i = 0; i < this.levelList.length; i++){
            const tempList = []

            for (const neuron of this.levelList[i]) {
                if (list.length !== neuron.weightList.length) throw new Error("Entrada inválida")
                tempList.push(neuron.g(list))
            }

            list = tempList
        }

        return list
    }

    // Realiza mutação em todos os neurônios existentes
    mutate(rate = 1) {
        for (const level of this.levelList) {
            for (const neuron of level) neuron.mutate(rate)
        }
    }
    
    // Carrega a configuração de uma RNA existente
    load(rna) {
        if (!rna) return;
        try {
            this.levelList = rna.map((neuronList) => {
                return neuronList.map((neuron) => {
                    const n = new Neuron()
                    n.bias = neuron.bias
                    n.weightList = neuron.weightList;
    
                    return n
                })
            })
        } catch (e) {
            return
        }
    }
    
    // Salva a configuração atual da RNA
    save() {
        return this.levelList
    }
}


export default RNA

