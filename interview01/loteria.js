'use strict';
/**
 * Ejercicio por David Poza Suárez
 * Fecha de creación: 28/07/2019
 *
 * NOTA: Este es un script para ser ejecutado con Node.js.
 * He usado sintaxis ES6 y se ha probado en entorno Windows con Node.js v10.11.0
 *
 *
 * DESCRIPCIÓN:
 *
 * Existe una leyenda urbana acerca de una frecuencia especial, en donde al sintonizarse,
 * uno puede escuchar los números de la lotería del mes.
 *
 * Tu curiosidad y habilidades para encontrar secretos te llevan a encontrar una lista en internet
 * con ajustes de frecuencia (incrementando o decrementando), que probablemente, te harán llegar
 * a la frecuencia secreta.
 *
 * Considera lo siguiente:
 *
 * Tu frecuencia inicial es 0
 * Si la lista es: +1 el resultado final será 1
 * Si la lista es: +1, -1 el resultado final será 0
 * Si la lista es: +3, -10, +1 el resultado final será -6
 * Descarga el input que se encuentra a continuación, crea un script en tu lenguaje favorito para
 * resolver este ejercicio utilizando los datos que descargarás como input. Revisa tu resultado final
 * y envíanos tu código a través de este editor. ¡Buena suerte!
 */

const fs = require("fs");


class RadioTuner {
    constructor(initial_frequency){
        this._frequency = initial_frequency;
        this.setFrequencyFromFile = this.setFrequencyFromFile.bind(this);
    }

    printFrequency(){
        console.log("Frequency obtained after applying read adjustments is: "+ this._frequency);
    }

    /**
     * @param {*} filename File witch contains an integer number by line,
     * always preceded by a symbol '+' to add o '-' to subtract.
     *
     * @returns Promise to manage async reading of file
     */
    setFrequencyFromFile(filename){
        let p = new Promise((resolve, reject)=>{
            fs.readFile(filename, "utf-8", (err, str)=>{
                if(err) {
                    return reject(err);
                } else {
                    /* I read the entire file into an string and then chop it as an array of lines using a regex,
                    just in case the new line symbol is in Microsft format in Linux format. */
                    let res = str.split(/\r?\n/).reduce((prev_line, curr_line, index)=>{
                        if(curr_line.indexOf(" ") >= 0){
                            return reject(new Error("Incorrect line format in file. Line "+parseInt(index+1)+" shouldn't contain spaces."));
                        }

                        let op = curr_line.slice(0,1);
                        if(op != "+" && op != "-")
                            return reject(new Error("Incorrect line format in file. Line "+parseInt(index+1)+" should start with add or subtract operation."));

                        let number = parseInt(curr_line.slice(1));
                        if(isNaN(Number.isInteger(number)))
                            return reject(new Error("Incorrect line format in file. Number in line "+parseInt(index+1)+" should be and integer."))

                        if(op == "+")
                            return prev_line + number;
                        else if(op == "-")
                            return prev_line - number;
                    }, this._frequency); //I pass the initial frequency value
                    this._frequency = res;
                    return resolve();
                }
            });
        });
        return p;

    }
}

//Main program

let radio = new RadioTuner(0); //I initialize the radio frequency to zero
radio.setFrequencyFromFile("input.txt")
    .then(()=>{
        radio.printFrequency();
    })
    .catch((err)=>{
        console.error("An error has been occurred: "+err.message)
    });
