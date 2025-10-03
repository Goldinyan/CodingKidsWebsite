

class Mentor {
    private id: number;
    private name: string;
    private description: string;
    private picture: string;

    constructor(id: number, name:string, description: string, picture: string){
        this.id = id,
        this.name = name,
        this.description = description,
        this.picture = picture
    }

    change(newId:number, newName: string, newDescription: string, newPicture: string){
        this.id = newId,
        this.name = newName;
        this.description = newDescription,
        this.picture = newPicture
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name
    }

    getDescription(){
        return this.description
    }

    getPicture(){
        return this.picture
    }
}
 
 
const allMentores: Mentor[] = [
  new Mentor(1, "Nicky", "Ich bin Nicky, 38 Jahre alt und Mutter von zwei tollen Kindern. Als Teammitglied im Vereinsvorstand bin ich als Mentor bei allen CoderDojo-Treffen dabei und unterstütze euch wenn ihr mich braucht. Ich freue mich, bald ganz viele Ninjas bei uns in den CUBES Wesel begrüßen zu dürfen und euch bei den vielen tollen Projekten zu begleiten.", "nicky.jpg"),
  new Mentor(2, "Daniel", "Ich heiße Daniel und sorge als Safeguarding Sponsor dafür, dass beim CoderDojo alles seine Richtigkeit hat. Außerdem bin ich der 2. Vorsitzende des Vereins. Als ausgebildeter Systemadministrator arbeite ich im IT-Bereich und freue mich, im Rahmen unserer CoderDojos Kindern und Jugendlichen den Einstieg in die IT zu ermöglichen.", "daniel.jpg"),
  new Mentor(3, "Michael", "Ich bin Michael und der Champion vom CoderDojo und 1. Vorsitzender des Vereins. Ich bin 33 Jahre alt und habe meinen Bachelor in Angewandte Informatik an der Universität Duisburg-Essen absolviert. Anschließend arbeitete ich in verschiedenen Bereichen, von der Softwareentwicklung über die Testautomatisierung bis hin zum DevOps-Engineer. Ich freue mich, dass wir in den CUBES Wesel die Möglichkeit bekommen haben, dort CoderDojos veranstalten zu dürfen.", "michael.jpg"),
  new Mentor(4, "Sebastian", "Ich bin Sebastian und seit Anfang 2023 einer der Mentoren bei den CodingKids Niederrhein. Ich habe Informatik an der Universität Duisburg-Essen studiert und anschließend am Lehrstuhl für verteilte Systeme promoviert. Seitdem arbeite ich als Softwareentwickler/-Berater in verschiedenen Technologiebereichen. Es freut mich, die Kinder, bei der Umsetzung ihrer Ideen und Projekte, zu unterstützen und ihnen dabei spielerisch und mit Spaß das Thema Informatik näherzubringen.", "sebastian.jpg"),
  new Mentor(5, "Malte", "", "malte.png")
];

const Dummy: Mentor = new Mentor(1, "Dummy", "ALALALAL", "dummy.jpeg")

export { allMentores, Dummy };


 
  
 
 
 
 
 
 
 
 
 
 
 
 // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const data = await getUserData(user.uid);
  //       setUserData(data);
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);