import {Link} from "react-router-dom";

function HomePage() {
  const features= [{name: "Explore Groups", description: "View all the groups you are in and their expenses", image: "/feature1"}, {name: "Create Groups", description: "Create a new group and invite your friends", image: "/feature2"}, {name: "Manage Expenses", description: "Add expenses and see them in the group overview and see their details", image: "/feature3"},{name: "View the expenses on a group", description: "View the expenses and delete your expenses if they are not relevant", image: "/feature4" }, {name: "Manage the state of your lendings and borrowings", description: "Mark the transactions paid or not and watch if people have reimbursed you.", image: "/feature5"}, {name: "Manage Groups", description: "Add and delete users, modify the name of the group", image: "/feature7"}, {name: "Manage Profile", description: "Edit your profile", image: "/feature6"}]

  return (
    <div className="from-primary to-tertiary bg-gradient-to-bl h-screen overflow-hidden">
      <div className="flex flex-col items-center h-full mt-20 overflow-x-scroll pb-40">
        <img className="mb-11" src="/logo.svg"/>
        <h1 className="text-5xl font-semibold leading-6 text-gray-900 first-letter:uppercase mb-11">Welcome to Pycount</h1>
        <p className="text-xl font-semibold leading-6 text-gray-900 first-letter:uppercase mb-11">The app to manage your
          expenses</p>
        <div className="flex flex-row justify-center items-center mb-11">
          <Link to="/login"
                className="bg-primary text-darkMode-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-5">Login</Link>
          <Link to="/register"
                className="bg-primary text-quaternary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</Link>
        </div>
        <hr className="border-black border-2 w-5/6 mb-11"/>
        <h1 className="text-5xl font-semibold leading-6 text-gray-900 first-letter:uppercase">Features</h1>
        {features.map(feature =>
          <div key={feature.name}
               className="flex justify-between sm:rounded-3xl w-full flex-col mb-2 sm:mt-5 sm:mb-5 items-center">
            <div className="flex sm:py-5 p-6 flex-col items-center h-full w-full min-w-0">
              <div className="min-w-0 flex flex-col justify-center">
                <h1
                  className="text-3xl font-semibold leading-6 text-gray-900 first-letter:uppercase">{feature.name}</h1>
                <p>{feature.description}</p>
                <img className="max-h-[800px] w-fit" src={feature.image} alt={"description of the feature"}/>
              </div>
            </div>
            <hr className="w-11/12"/>
          </div>)}
      </div>
    </div>
  )
}

export default HomePage;

