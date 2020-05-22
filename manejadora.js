var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Entidades;
(function (Entidades) {
    var Ropa = /** @class */ (function () {
        function Ropa(c, n, p) {
            this.codigo = c;
            this.nombre = n;
            this.precio = p;
        }
        Ropa.prototype.ToString = function () {
            return '"codigo":"' + this.codigo + '","nombre":"' + this.nombre + '","precio":"' + this.precio + '"';
        };
        return Ropa;
    }());
    Entidades.Ropa = Ropa;
})(Entidades || (Entidades = {}));
/// <reference path="ropa.ts" />
var Entidades;
(function (Entidades) {
    var Campera = /** @class */ (function (_super) {
        __extends(Campera, _super);
        function Campera(cod, nom, pre, tal, col) {
            var _this = _super.call(this, cod, nom, pre) || this;
            _this.talle = tal;
            _this.color = col;
            return _this;
        }
        Campera.Campera = function (jCam) {
            return new Campera(jCam.codigo, jCam.nombre, jCam.precio, jCam.talle, jCam.color);
        };
        Campera.prototype.ToJson = function () {
            return JSON.parse('{' + _super.prototype.ToString.call(this) + ',"talle":"' + this.talle + '","color":"' + this.color + '"}');
        };
        return Campera;
    }(Entidades.Ropa));
    Entidades.Campera = Campera;
})(Entidades || (Entidades = {}));
/// <reference path="campera.ts" />
/// <reference path="node_modules/@types/jquery/index.d.ts" />
var Campera = Entidades.Campera;
var Test;
(function (Test) {
    var Manejadora = /** @class */ (function () {
        function Manejadora() {
        }
        /**6.- CargarColoresJSON. Cargará (por AJAX) (caso=”colores”) en el combo (cboColor) con el
        contenido del archivo “./BACKEND/colores.json”. Si se invoca varias veces, no se deberán repetir
        los colores. */
        Manejadora.CargarColoresJSON = function () {
            $.ajax({
                data: { "caso": "colores" },
                type: 'POST',
                async: true,
                url: './BACKEND/administrar.php'
            }).done(function (response) {
                $('#cboColores').empty();
                var coloresJ = JSON.parse(response);
                console.log(coloresJ);
                Object.keys(coloresJ).forEach(function (key) {
                    var opt = document.createElement('option');
                    var clr = coloresJ[key].descripcion;
                    opt.innerHTML = clr;
                    //$('#cboColores').append(opt);
                    document.getElementById('cboColores').appendChild(opt);
                });
            });
        };
        /**5.- FiltrarCamperasPorColor. Mostrará (por AJAX) (caso=”mostrar”) un listado dinámico (en el
        FRONTEND) de todas las camperas según el color seleccionado en el combo (cboColor). */
        Manejadora.FiltrarCamperasPorColor = function () {
            var cl = $('#cboColores').find('option:selected').text();
            $.ajax({
                data: { "caso": "mostrar" },
                type: 'POST',
                async: true,
                url: './BACKEND/administrar.php'
            }).done(function (response) {
                //console.log(JSON.stringify(response));
                var count = 0;
                $('#divTabla').empty();
                var table = document.createElement('table');
                table.setAttribute('style', 'border: 1px solid black;padding: 5px');
                var jsonArray = JSON.parse(response);
                Object.keys(jsonArray).forEach(function (campo) {
                    if (jsonArray[campo].color == cl) {
                        var tr = Manejadora.TableRow(jsonArray[campo]);
                        if (count % 2 == 0) {
                            tr.setAttribute('style', 'background-color:lightgray');
                        }
                        table.appendChild(tr);
                        count++;
                    }
                });
                document.getElementById('divTabla').appendChild(table);
            });
        };
        /**4.- ModificarCampera. Mostrará todos los datos de la campera que recibe por parámetro (objeto
        JSON), en el formulario. Permitirá modificar cualquier campo, a excepción del código.
        Modificar el método AgregarCampera para cambiar el caso de “agregar” a “modificar”, según
        corresponda. */
        Manejadora.ModificarCampera = function (strJson) {
            var objJson = JSON.parse(strJson);
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
        };
        /**3.- EliminarCampera. Eliminará a la campera del archivo (por AJAX) (caso=”eliminar”). Recibe
        como parámetro al objeto JSON que se ha de eliminar. Pedir confirmación, mostrando código y talle,
        antes de eliminar. Refrescar el listado para visualizar los cambios. */
        Manejadora.EliminarCampera = function (strJ) {
            var obj = JSON.parse(strJ);
            var frmDta = Manejadora.PrepararFormData(obj, 'eliminar');
            var response = Manejadora.Consultar('./BACKEND/administrar.php', frmDta);
        };
        /**2.- MostrarCamperas. Recuperará (por AJAX) a todas las camperas del archivo .json
        (caso=”mostrar”) y generará un listado dinámico (en el FRONTEND) que mostrará toda la
        información de cada una de las camperas. Agregar columnas al listado que permitan: Eliminar y
        Modificar a la campera elegida. */
        Manejadora.MostrarCampera = function () {
            $.ajax({
                data: { "caso": "mostrar" },
                type: 'POST',
                async: true,
                url: './BACKEND/administrar.php'
            }).done(function (response) {
                console.log(JSON.stringify(response));
                var count = 0;
                $('#divTabla').empty();
                var table = document.createElement('table');
                table.setAttribute('style', 'border: 1px solid black;padding: 5px');
                var jsonArray = JSON.parse(response);
                Object.keys(jsonArray).forEach(function (campo) {
                    var tr = Manejadora.TableRow(jsonArray[campo]);
                    if (count % 2 == 0) {
                        tr.setAttribute('style', 'background-color:lightgray');
                    }
                    table.appendChild(tr);
                    count++;
                });
                document.getElementById('divTabla').appendChild(table);
            });
        };
        /**1.- AgregarCampera. Tomará los distintos valores desde la página index.html, creará un objeto de
         tipo Campera, que se enviará (por AJAX) junto al parámetro caso (con valor “agregar”), hacia
         “./BACKEND/adminstrar.php”. En esta página se guardará al ciudadano en el archivo
         “./BACKEND/camperas.json”. */
        Manejadora.AgregarCampera = function (metodo) {
            if (metodo == null) {
                metodo = "agregar";
            }
            console.log($('#cboColores').find('option:selected').text());
            var obj = Manejadora.CrearObjeto();
            var frmDta = Manejadora.PrepararFormData(obj, metodo);
            var response = Manejadora.Consultar('./BACKEND/administrar.php', frmDta);
        };
        Manejadora.CrearObjeto = function () {
            var objeto = new Campera(parseInt($('#txtCodigo').val().toString()), $('#txtNombre').val().toString(), parseFloat($('#txtPrecio').val().toString()), $('#txtTalle').val().toString(), $('#cboColores').find('option:selected').text());
            //$('#cboColores').val().toString(),);
            console.log(objeto.ToJson());
            return objeto;
        };
        Manejadora.PrepararFormData = function (objeto, caso) {
            var frmDta = new FormData();
            //let foto : any= $('#foto')[0];
            frmDta.append('cadenaJson', JSON.stringify(objeto));
            frmDta.append('caso', caso);
            //console.log(objeto.toString());
            //frmDta.append('foto', foto.files[0]);
            return frmDta;
        };
        Manejadora.Consultar = function (destineUrl, frmDta) {
            var res = null;
            $.ajax({
                async: true,
                type: 'POST',
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                url: destineUrl,
                data: frmDta
            }).done(function (resultado) {
                return resultado;
            }).fail(function () {
                ///
                console.log('fallo');
            });
        };
        Manejadora.Table = function (response) {
            var count = 0;
            var table = document.createElement('table');
            table.setAttribute('style', 'border: 1px solid black;padding: 5px');
            var jsonArray = JSON.parse(response);
            Object.keys(jsonArray).forEach(function (campo) {
                var tr = Manejadora.TableRow(jsonArray[campo]);
                if (count % 2 == 0) {
                    tr.setAttribute('style', 'background-color:lightgray');
                }
                table.appendChild(tr);
                count++;
            });
            return table;
        };
        Manejadora.TableRow = function (objeto) {
            var tr = document.createElement('tr');
            Object.keys(objeto).forEach(function (keys) {
                var td = document.createElement('td');
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
                var text = document.createTextNode(objeto[keys]);
                td.appendChild(text);
                tr.appendChild(td);
            });
            ///Botones mod elim
            var id = JSON.stringify(objeto);
            //console.log(id);
            var btnMod = document.createElement('button');
            btnMod.setAttribute('onclick', "Test.Manejadora.ModificarCampera('" + id + "')"); //modificar llamado
            btnMod.appendChild(document.createTextNode('Modificar'));
            var btnElim = document.createElement('button');
            btnElim.setAttribute('onclick', "Test.Manejadora.EliminarCampera('" + id + "')"); //modificar llamado
            btnElim.appendChild(document.createTextNode('Eliminar'));
            tr.appendChild(btnMod);
            tr.appendChild(btnElim);
            ///
            return tr;
        };
        return Manejadora;
    }());
    Test.Manejadora = Manejadora;
})(Test || (Test = {}));
