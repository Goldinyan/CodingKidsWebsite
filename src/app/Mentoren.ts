

class Mentor {
    private id: string;
    private name: string;
    private description: string;
    private picture: string;

    constructor(id: string, name:string, description: string, picture: string){
        this.id = id,
        this.name = name,
        this.description = description,
        this.picture = picture
    }

    changeDescription(newText: string){
        this.description = newText;
    }
    
    changeName(newName: string){
        this.name = newName 
    }
}
 
 
const allMentores: Mentor[] = [
  new Mentor("1", "Lena", "Frontend Expertin", "lena.jpg"),
  new Mentor("2", "Tom", "Backend Spezialist", "tom.jpg"),
];

export default allMentores;

 
 
 
 
 
 
 
 
 
 
 
 
 
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