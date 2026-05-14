//Declarações dos elementos usando DOM(Document Object Model)
const videoElemento = document.getElementById("video");
const botaoEscanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//Função para habilitar a câmera

async function configurarCamera(){
    //tratamento de erros 
    try{
        //chama a API do navegador para solicitar acesso a câmera
        const midia= await navigator.mediaDevices.getUserMedia({
            //habilita a câmera traseira
            video:{ facingMode: "environment"},
            //o audio não será capturado
            audio: false
        });
        //recebe a função midia para ser executada
        videoElemento.srcObject=midia;
        //força a reprodução do vídeo
        videoElemento.play();
    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera",erro;
    }
}
//exec função
configurarCamera();

//função para capturar o texto da câmera
botaoEscanear.onclick = async ()=>{
    botaoEscanear.disabled=true; //habilitando a câmera
    resultado.innerText="Fazendo a leitura do texto...aguarde";
    
    //Define o canvas para iniciar a leitura
    const contexto = canvas.getContext("2d");

    //ajusta o tamanho do canvas paa o tamanho real do vídeo 
    canvas.width =videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //aplica o filtro para melhorar o OCR
    contexto.filter="contraste(1.2) grayscale(1)";

    //deseha o video no canvas

    contexto.drawImage(videoElemento,0,0, canvas.width, canvas.height);

    try{
        const {data:{text}}=await Tesseract.recognize(
            canvas,
            "por" //define o idioma
        );
        //Remove os espaços em branco
        const textofinal= text.trim();
        //Estrutura condicional ternaria ? (if) : (else)
        resultado.innerText=textofinal.lenght > 0? textofinal: "Não foi possível identificar o texto";
        
    }catch(erro){
        resultado.innerText="Erro no processamento",erro
    }
    finally{
        //desabilia o botão para fazer a nova captura
        botaoEscanear.disabled=false;
    }
}