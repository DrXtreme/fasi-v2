class Runner{
    // constructor(name,drawn,fee,cardsRec,cardsSent,diposited){
    //     this.name=name;
    //     this.drawn=drawn;
    //     this.diposited=diposited;
    //     this.cardsRec=cardsRec;
    //     this.cardsSent=cardsSent;
    //     this.fee=fee;
    // }

    constructor(id,name,drawn,fee,cardsRec,cardsSent,diposited){
        this.id=id;
        this.name=name;
        this.drawn=drawn;
        this.diposited=diposited;
        this.cardsRec=cardsRec;
        this.cardsSent=cardsSent;
        this.fee=fee;
    }

    getCredit(){
        return this.credit-((this.cardsRec-this.cardsSent)*this.fee)-this.diposited;
    }

    storeNew(){
        var form = new FormData();
        form.set('addRunner',1);
        form.set('name',this.name);
        form.set('drawn',this.drawn);
        form.set('diposited',this.diposited);
        form.set('cardsRec',this.cardsRec);
        form.set('cardsSent',this.cardsSent);
        form.set('fee',this.fee);
<<<<<<< HEAD
        fetch('https://atest.fasicurrency.com/',{
=======
        fetch('http://localhost:8080/',{
>>>>>>> tmp
            method:'POST',
            body:form
        }).then((res) =>{
            res.text();
        }).then(reso => {
            // switch(resa){
            //   case "": break;
            //   case "SuccessMore Success": window.location = '/done'; break;
            //   case "Success": break;
            //   default: break;
            // }
            if(reso.toString().localeCompare("Success")===0){
                window.location = '/done';
            }
        });
    }

    static retreiveById(id) {
        var form = new FormData();
        form.set('getRunner',1);
        form.set('id',id);
<<<<<<< HEAD
        fetch('https://atest.fasicurrency.com/',{
=======
        fetch('http://localhost:8080/',{
>>>>>>> tmp
            method:'POST',
            body:form
        }).then(res => {
            res.json();
        }).then(data => {
            return new Runner(data.id,data.name,data.drawn,data.fee,data.cardsRec,data.cardsSent,data.diposited);
        })
    }

    static retreiveAll(){
        var form = new FormData();
        form.set('runners',1);
<<<<<<< HEAD
        fetch('https://atest.fasicurrency.com/',{
=======
        fetch('http://localhost:8080/',{
>>>>>>> tmp
            method: 'POST',
            body: form
        }).then(res => {
            res.json();
        }).then(data => {
            return data;
        })
    }

}