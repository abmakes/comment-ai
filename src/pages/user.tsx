import { SignInButton, UserProfile, SignOutButton, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const { userId } = useAuth();

  return (
    <>
      <Head>
        <title>Comments-AI</title>
        <meta name="description" content="Generated by create-t3-app"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-between items-center w-full h-screen overflow-y-scroll">
          <div className="absolute -z-50 bg-[url('/bg-GRADIENT.svg')] bg-no-repeat bg-cover h-full w-full "></div>
          
          { !userId &&
          <div className="container px-0 flex flex-col items-center h-full w-full max-w-4xl justify-center"> 
          
              <h1 className="text-2xl flex items-center font-poppins font-semibold tracking-tight text-gray-800 sm:text-3xl p-3">
                you are logged out...
              </h1>

              <SignInButton>
                <div className="w-64 h-12 rounded-full flex items-center justify-center border bg-gray-600 text-white border-gray-700 hover:text-violet-800 hover:fill-violet-800 hover:border-violet-800 hover:bg-violet-50 hover:shadow mb-3 cursor-pointer">
                  Sign in
                </div>
              </SignInButton>
              <Link href="../">              
                <div className="w-64 h-12 rounded-full flex items-center justify-center border text-gray-600 bg-white border-gray-700 hover:text-violet-800 hover:fill-violet-800 hover:border-violet-800 hover:bg-violet-50 hover:shadow mb-3 cursor-pointer">
                  Home
                </div>
              </Link>

            </div>
          }
          
          { !!userId && 
            <>
              <div className="flex justify-between w-full max-w-4xl items-center">
                <Link href={'../'}>
                  <h1 className="text-2xl flex items-center font-poppins font-semibold tracking-tight text-gray-800 sm:text-3xl p-3">
                  comments-ai
                  </h1>
                </Link>

                <nav className="flex items-center justify-between h-16">
                  <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="sm:block sm:ml-6">
                      <div className="flex space-x-4 px-3 text-gray-600 text-sm font-medium">
                        <Link href="../">
                          <div className="hover:text-violet-600 hover:fill-violet-600 hover:border-violet-400 hover:bg-violet-50 hover:shadow text-gray-600 fill-gray-600  border rounded-full font-semibold h-7 px-3 flex gap-2 items-center cursor-pointer">
                            Home
                          </div>
                        </Link>
                      
                        <div className="hover:text-violet-600 hover:fill-violet-600 hover:border-violet-400 hover:bg-violet-50 hover:shadow text-gray-600 fill-gray-600 border rounded-full font-semibold h-7 px-3 flex items-center cursor-pointer">
                          <SignOutButton />
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>

              <UserProfile /> 
            </>
          }
        <footer className="text-xs text-gray-500 p-3">
          {String.fromCharCode(169)+" "} abMakes 2023 
          {` `+ String.fromCharCode(183)} powered by openAI
        </footer>
      </main>
    </>
  );
}