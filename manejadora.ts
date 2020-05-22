/// <reference path="campera.ts" />
/// <reference path="node_modules/@types/jquery/index.d.ts" />
import Campera = Entidades.Campera;
namespace Test{

    export class Manejadora{
        /**6.- CargarColoresJSON. Cargará (por AJAX) (caso=”colores”) en el combo (cboColor) con el
        contenido del archivo “./BACKEND/colores.json”. Si se invoca varias veces, no se deberán repetir
        los colores. */
        public static CargarColoresJSON(){
            $.ajax({
                data: {"caso" : "colores"},
                type: 'POST',
                async: true,
                url: './BACKEND/administrar.php'
            }).done(function(response){
                
                $('#cboColores').empty();
                let coloresJ = JSON.parse(response);
                console.log(coloresJ);
                Object.keys(coloresJ).forEach(key =>{
                    let opt = document.createElement('option');
                    let clr : string = coloresJ[key].descripcion;
                    opt.innerHTML = clr;
                    //$('#cboColores').append(opt);
                    document.getElementById('cboColores').appendChild(opt);
                })
            });
        }
        /**5.- FiltrarCamperasPorColor. Mostrará (por AJAX) (caso=”mostrar”) un listado dinámico (en el
        FRONTEND) de todas las camperas según el color seleccionado en el combo (cboColor). */
        public static FiltrarCamperasPorColor(){
            let cl = $('#cboColores').find('option:selected').text();
            $.ajax({
                data: {"caso" : "mostrar"},
                type: 'POST',
                async: true,
                url: './BACKEND/administrar.php'
            }).done(function(response){
                //console.log(JSON.stringify(response));
                let count = 0;
                $('#divTabla').empty();
                let table = document.createElement('table');
                table.setAttribute('style', 'border: 1px solid black;padding: 5px');
                let jsonArray = JSON.parse(response);
                Object.keys(jsonArray).forEach(campo =>{
                    if(jsonArray[campo].color == cl){
                        let tr = Manejadora.TableRow(jsonArray[campo]);
                        if(count % 2 == 0){ tr.setAttribute('style', 'background-color:lightgray')}
                        table.appendChild(tr);
                        count++;
                    }
                });
                document.getElementById('divTabla').appendChild(table);
            });
        }

        /**4.- ModificarCampera. Mostrará todos los datos de la campera que recibe por parámetro (objeto
        JSON), en el formulario. Permitirá modificar cualquier campo, a excepción del código.
        Modificar el método AgregarCampera para cambiar el caso de “agregar” a “modificar”, según
        corresponda. */
        public static ModificarCampera(strJson : string){
            let objJson = JSON.parse(strJson);
            console.log(objJson);
            $('#txtCodigo').val(objJson.codigo);
            $('#txtCodigo').attr('readonly', '');
            $('#txtTalle').val(objJson.talle);
            $('#txtNombre').val(objJson.nombre);
            $('#txtPrecio').val(objJson.precio);
            $('#cboColor').val(objJson.color);
            $('#Agregar').attr('onclick', "Test.Manejadora.AgregarCampera('modificar')");
            //let obj = Manejadora.CrearObjeto();
            //let frmDta = Manejadora.PrepararFormData(obj, 'modificar');
            //let response = Manejadora.Consultar('./BACKEND/modificar_bd.php', frmDta);
        }
        /**3.- EliminarCampera. Eliminará a la campera del archivo (por AJAX) (caso=”eliminar”). Recibe
        como parámetro al objeto JSON que se ha de eliminar. Pedir confirmación, mostrando código y talle,
        antes de eliminar. Refrescar el listado para visualizar los cambios. */
        public static EliminarCampera(strJ : string){
            let obj = JSON.parse(strJ);
            let frmDta = Manejadora.PrepararFormData(obj, 'eliminar');
            let response = Manejadora.Consultar('./BACKEND/administrar.php', frmDta);
        }
        /**2.- MostrarCamperas. Recuperará (por AJAX) a todas las camperas del archivo .json
        (caso=”mostrar”) y generará un listado dinámico (en el FRONTEND) que mostrará toda la
        información de cada una de las camperas. Agregar columnas al listado que permitan: Eliminar y
        Modificar a la campera elegida. */
        public static MostrarCampera(){
            $.ajax({
                data: {"caso" : "mostrar"},
                type: 'POST',
                async: true,
                url: './BACKEND/administrar.php'
            }).done(function(response){
                console.log(JSON.stringify(response));
                let count = 0;
                $('#divTabla').empty();
                let table = document.createElement('table');
                table.setAttribute('style', 'border: 1px solid black;padding: 5px');
                let jsonArray = JSON.parse(response);
                Object.keys(jsonArray).forEach(campo =>{
                    let tr = Manejadora.TableRow(jsonArray[campo]);
                    if(count % 2 == 0){ tr.setAttribute('style', 'background-color:lightgray')}
                    table.appendChild(tr);
                    count++;
                });
                document.getElementById('divTabla').appendChild(table);
            })
        }
        /**1.- AgregarCampera. Tomará los distintos valores desde la página index.html, creará un objeto de
         tipo Campera, que se enviará (por AJAX) junto al parámetro caso (con valor “agregar”), hacia
         “./BACKEND/adminstrar.php”. En esta página se guardará al ciudadano en el archivo
         “./BACKEND/camperas.json”. */
         public static AgregarCampera(metodo? : string){
            if(metodo == null){metodo = "agregar"}
             console.log($('#cboColores').find('option:selected').text());
            let obj = Manejadora.CrearObjeto();
            let frmDta = Manejadora.PrepararFormData(obj, metodo);
            let response = Manejadora.Consultar('./BACKEND/administrar.php', frmDta); 
        }
        public static CrearObjeto() : Campera{
            let objeto :Campera = new Campera(
                parseInt($('#txtCodigo').val().toString()),
                $('#txtNombre').val().toString(),
                parseFloat($('#txtPrecio').val().toString()),
                $('#txtTalle').val().toString(),
                $('#cboColores').find('option:selected').text());
                //$('#cboColores').val().toString(),);
            console.log(objeto.ToJson());
            return objeto;
        }
        public static PrepararFormData(objeto : Campera, caso : string){
            let frmDta = new FormData();
            //let foto : any= $('#foto')[0];
            frmDta.append('cadenaJson', JSON.stringify(objeto));
            frmDta.append('caso', caso);
            //console.log(objeto.toString());
            //frmDta.append('foto', foto.files[0]);
            return frmDta;
        }
        public static Consultar(destineUrl : string, frmDta : FormData) : any{
            let res : string = null;
            $.ajax({
                async: true,
                type: 'POST',
                dataType: 'json',
                cache : false,
                contentType: false,
                processData: false,
                url: destineUrl,
                data: frmDta
            }).done(function(resultado){
                return resultado;
            }).fail(function (){
                ///
                console.log('fallo');
            });
        }
        private static Table(response) : HTMLTableElement{
            let count = 0;
            let table = document.createElement('table');
            table.setAttribute('style', 'border: 1px solid black;padding: 5px');
            let jsonArray = JSON.parse(response);
            Object.keys(jsonArray).forEach(campo =>{
                let tr = Manejadora.TableRow(jsonArray[campo]);
                if(count % 2 == 0){ tr.setAttribute('style', 'background-color:lightgray')}
                table.appendChild(tr);
                count++;
            });
            return table;
        }private static TableRow(objeto){
            let tr = document.createElement('tr');
            Object.keys(objeto).forEach(keys =>{
                let td = document.createElement('td');
                td.setAttribute('style', 'width: 100px;border: 1px solid black;padding= 3px');
                /*if(keys.toString() == 'pathFoto'){
                    let img = document.createElement('img');
                    img.setAttribute('src', './BACKEND/fotos/' + objeto[keys]);//cambiar path acorde al proyecto
                    img.setAttribute('style', 'width:100px;height:100px');
                    td.appendChild(img);
                }else{
                    let text = document.createTextNode(objeto[keys]);
                    td.appendChild(text);
                }*/
                //console.log(keys);
                let text = document.createTextNode(objeto[keys]);
                td.appendChild(text);
                tr.appendChild(td);
            });
            ///Botones mod elim
            let id =  JSON.stringify(objeto);
            //console.log(id);
            let btnMod = document.createElement('button');
            btnMod.setAttribute('onclick', "Test.Manejadora.ModificarCampera('" + id + "')");//modificar llamado
            btnMod.appendChild(document.createTextNode('Modificar'));
            let btnElim = document.createElement('button');
            btnElim.setAttribute('onclick' , "Test.Manejadora.EliminarCampera('" + id + "')");//modificar llamado
            btnElim.appendChild(document.createTextNode('Eliminar'));
            tr.appendChild(btnMod);
            tr.appendChild(btnElim);
            ///
            return tr;
        }
    }
    
}