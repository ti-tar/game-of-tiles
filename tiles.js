'use strict';

class TheTilesGame extends HTMLElement {

    constructor(){
        super();
    }

    connectedCallback(){

        this.options = {
            currentX :0,
            currentY :0,
            sizeX : 4,
            sizeY : 4,
        };

        for (let key in this.options) {
            this.options[key] = parseInt( key in this.attributes ? this.attributes[key].value : this.options[key]);
        }

        console.log(this.options);
        this.attachShadow({mode: 'open'});

        let template = document.querySelector('link#tiles-scaffold-module').import.querySelector('template').content;
        this.shadowRoot.appendChild(document.importNode(template, true));
        this.initDOM();
        this.initMatrix();
        this.initRender();
    }

    initDOM(){
        /*
         * <tiles-node>
         *     #shadow
         *     \ <tiles-place> :
         *                 top-arrow
         *                 topArrow
         *              ----------------
         * left-arrow  |  table       | right-arrow
         * leftArrow   |  table       | rightArrow
         *             |       \ tbody|
         *             ----------------
         *                bottom-arrow
         *                bottomArrow
         * */


        // в tbody будут рендериться tr/td
        this.tbody = this.shadowRoot.querySelector('tbody');

        // стрелки
        this.topArrow = this.shadowRoot.querySelector('top-arrow');
        this.leftArrow = this.shadowRoot.querySelector('left-arrow');
        this.rightArrow = this.shadowRoot.querySelector('right-arrow');
        this.bottomArrow = this.shadowRoot.querySelector('bottom-arrow');


        //Обработчики
        this.addEventListener('mouseleave', () => {
            this.constructor.hideElement(this.topArrow);
            this.constructor.hideElement(this.leftArrow);
        });

        //все опции закину в один метод для читаемости

        this.topArrow.addEventListener("click", () => {
            this.makeAction('delColunm');
        });
        this.leftArrow.addEventListener("click", () => {
            this.makeAction('delRow');
        });
        this.rightArrow.addEventListener("click", () => {
            this.makeAction('addColunm');
        });
        this.bottomArrow.addEventListener("click", () => {
            this.makeAction('addRow');
        });
    }

    setArrowsPositionsAccordingToDOMElement(domElem){
        let [top, left, width, height] = [domElem.offsetTop, domElem.offsetLeft, domElem.clientWidth, domElem.offsetHeight];
        this.leftArrow.style.top = (top + height + 3) + 'px';
        this.topArrow.style.left = (left + width + 3) + 'px';
    }

    initMatrix(){
        this.matrix = new Array(this.options.sizeY).fill(0).
            map(() => new Array(this.options.sizeX).fill(0).
                map(() => this.constructor.getRandomNumber()));
    }

    initRender(){
        this.tbody.innerHTML = '';
        this.matrix.forEach((row) => {
            let tr = document.createElement("tr");

            row.forEach((cell) => {
                tr.appendChild(this.genNewTdElem(cell));
            });

            this.tbody.appendChild(tr);
        });
    }

    genNewTdElem(innerHTML = ''){
        let td = document.createElement("td");

        td.addEventListener("mouseover", (e) => {
            this.options.currentX = e.target.cellIndex;
            this.options.currentY = e.target.parentNode.rowIndex;
            this.options.sizeX === 1 || this.constructor.showElement(this.topArrow);
            this.options.sizeY === 1 || this.constructor.showElement(this.leftArrow);
            this.setArrowsPositionsAccordingToDOMElement(e.target);
        });

        td.innerHTML = innerHTML;

        return td;
    }

    makeAction(action = ''){

        switch (action){

        case 'delColunm':

            this.matrix.forEach((row) => {
                row.splice(this.options.currentX, 1);
            });

            for (let i=0; i < this.matrix.length; i++){
                let tdToRemove = this.tbody.children[i].children[this.options.currentX];
                this.tbody.children[i].removeChild(tdToRemove);
            }

            this.options.sizeX = this.matrix[0].length;

            //if last col
            if (this.options.currentX === this.options.sizeX){
                this.options.currentX -= 1;
                this.setArrowsPositionsAccordingToDOMElement(this.tbody.children[this.options.currentY].children[this.options.currentX]);
            }

            if (this.options.sizeX === 1) {
                this.constructor.hideElement(this.topArrow);
            }

            break;
        case 'delRow':

            this.matrix.splice(this.options.currentY, 1);

            let trToRemove = this.tbody.children[this.options.currentY];
            this.tbody.removeChild(trToRemove);

            this.options.sizeY = this.matrix.length;

            //if last row
            if (this.options.currentY === this.options.sizeY) {
                this.options.currentY -= 1;
                this.setArrowsPositionsAccordingToDOMElement(this.tbody.children[this.options.currentY].children[this.options.currentX]);
            }

            if (this.options.sizeY === 1){
                this.constructor.hideElement(this.leftArrow)
            }

            break;
        case 'addColunm':

            this.matrix.forEach((row) => {
                row.push(this.constructor.getRandomNumber());
            });
            this.options.sizeX += 1;
            for (let i = 0; i < this.options.sizeY; i++) {
                this.tbody.children[i].appendChild(this.genNewTdElem(this.matrix[i][this.options.sizeX - 1]))
            }
            break;
        case 'addRow':

            this.matrix.push(new Array(this.options.sizeX).fill(0).
                map(() => this.constructor.getRandomNumber()));
            this.options.sizeY += 1;

            let tr = document.createElement("tr");

            this.matrix[this.options.sizeY-1].forEach((cell) => {
                tr.appendChild(this.genNewTdElem(cell));
            });

            this.tbody.appendChild(tr);

            break;
        default:
            return false;
        }

        return true;
    }

    static hideElement(domElement) {
        domElement.style.display = 'none';

        return true;
    }

    static showElement(domElement) {
        domElement.style.display = 'block';

        return true;
    }

    static getRandomNumber(){
        return Math.floor((Math.random() * 10) + 1);
    }
}

customElements.define('tiles-node', TheTilesGame);