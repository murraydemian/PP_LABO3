namespace Entidades{

    export class Ropa{
        public codigo : number;
        public nombre : string;
        public precio : number;

        public constructor(c : number, n : string, p : number){
            this.codigo = c;
            this.nombre = n;
            this.precio = p;
        }
        
        public ToString(): String{
            return '"codigo":"' + this.codigo + '","nombre":"' + this.nombre + '","precio":"' + this.precio + '"';
        }
    }
}