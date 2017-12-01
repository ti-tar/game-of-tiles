'use strict';

class TheTilesGame {

    static init(selector, options={}){

        let domElems = document.querySelectorAll(selector);

        if (domElems.length){
            // run separated instance for each dom-elem
            domElems.forEach((mountNode) => new this(mountNode, options))
        } else {
            return false;
        }
    }

    constructor(mountNode, options={}){
        let defaultOptions = {
            currentX :0,
            currentY :0,
            sizeX : 4,
            sizeY : 4,
        };
        this.options = Object.assign({}, defaultOptions, options);
        this.mountNode = mountNode;
        this.run()
    }

    run(){
        this.initDOM();
        // init this.matrix - двумерный массив заполненый нолями
        this.initMatrix();
        // начальный рендер таблицы
        this.initRender()
    }

    initDOM(){
        /*
         * mountNode > .tiles :
         *                 .top-arrow
         *                 topArrow
         *              ----------------
         * .left-arrow  |  table       | .right-arrow
         * leftArrow    |  table       | rightArrow
         *              |       \ tbody|
         *              ----------------
         *                 .bottom-arrow
         *                 bottomArrow
         * */

        let link = document.querySelector('link#tiles-scaffold-module').import.querySelector('.tiles');
        this.target = link.cloneNode(true);
        this.mountNode.appendChild(this.target);


        // в tbody будут рендериться tr/td
        this.tbody = this.target.querySelector('tbody');

        // стрелки
        this.topArrow = this.target.querySelector('.top-arrow');
        this.leftArrow = this.target.querySelector('.left-arrow');
        this.rightArrow = this.target.querySelector('.right-arrow');
        this.bottomArrow = this.target.querySelector('.bottom-arrow');

        //Обработчики
        this.target.addEventListener('mouseleave', () => {
            this.hideElement(this.topArrow);
            this.hideElement(this.leftArrow);
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
        this.matrix = new Array(this.options.sizeY).fill(0).map(() => {
            return new Array(this.options.sizeX).fill(0).map(() => {
                return this.getRandomNumber()
            })
        });
    }

    initRender(){
        this.tbody.innerHTML = '';
        this.matrix.forEach((row)=>{
            let tr = document.createElement("tr");

            row.forEach((cell)=>{
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
            this.options.sizeX === 1 || this.showElement(this.topArrow);
            this.options.sizeY === 1 || this.showElement(this.leftArrow);
            this.setArrowsPositionsAccordingToDOMElement(e.target);
        });

        td.innerHTML = innerHTML;
        return td;
    }

    makeAction(action = ''){

        switch(action){

            case 'delColunm':
                //console.log('delColunm');

                this.matrix.forEach((row)=>{
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
                    this.hideElement(this.topArrow);
                }

                break;
            case 'delRow':
                //console.log('delRow');

                this.matrix.splice(this.options.currentY, 1);

                let trToRemove = this.tbody.children[this.options.currentY];
                this.tbody.removeChild(trToRemove);

                this.options.sizeY = this.matrix.length;

                //if last row
                if (this.options.currentY === this.options.sizeY) {
                    this.options.currentY -= 1;
                    this.setArrowsPositionsAccordingToDOMElement(this.tbody.children[this.options.currentY].children[this.options.currentX]);
                }

                if ( this.options.sizeY === 1 ){
                    this.hideElement(this.leftArrow)
                }

                break;
            case 'addColunm':
                // console.log('addColunm');
                this.matrix.forEach((row)=>{
                    row.push(this.getRandomNumber());
                });
                this.options.sizeX += 1;
                for (let i = 0; i < this.options.sizeY; i++) {
                    this.tbody.children[i].appendChild(this.genNewTdElem(this.matrix[i][this.options.sizeX - 1]))
                }
                break;
            case 'addRow':
                // console.log('addRow');
                this.matrix.push(new Array(this.options.sizeX).fill(0).map(item=>this.getRandomNumber()));
                this.options.sizeY += 1;

                let tr = document.createElement("tr");

                this.matrix[this.options.sizeY-1].forEach((cell)=>{
                    tr.appendChild(this.genNewTdElem(cell));
                });

                this.tbody.appendChild(tr);

                break;
            default:
                return
        }
    }

    static hideElement(domElement) {
        domElement.style.display = 'none';
    }

    static showElement(domElement) {
        domElement.style.display = 'block';
    }

    static getRandomNumber(){
        return Math.floor((Math.random() * 10) + 1);
    }
}