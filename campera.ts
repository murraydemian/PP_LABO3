/// <reference path="ropa.ts" />
namespace Entidades{

    export class Campera extends Ropa{
        public talle : string;
        public color : string;

        public constructor(cod : number, nom : string, pre : number, tal : string, col : string){
            super(cod, nom, pre);
            this.talle = tal;
            this.color = col;
        }
        public static Campera(jCam : any) : Campera{
            return new Campera(jCam.codigo, jCam.nombre, jCam.precio, jCam.talle, jCam.color);
        }

        public ToJson() : any{
            return JSON.parse('{' + super.ToString() + ',"talle":"' + this.talle + '","color":"' + this.color + '"}');
        }
    }
}