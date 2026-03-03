import ProjectForm from "@/modules/home/components/ProjectForm";
import { ProjectList } from "@/modules/home/components/ProjectList";


export default function Home() {
  return (
    <>
      <div className="flex flex-col-1 items-center justify-center h-screen w-screen p-4 py-8">
        <div className="max-w-5xl w-full mx-">
          <section className="space-y-8 flex flex-col items-center ">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-center">
                BUILD APPS WITH AI
              </span>
              <p className="text-center text-lg text-muted-foreground">
                power your apps with AI
              </p>
            </div>
          </section>
          <ProjectForm />
          <ProjectList />
        </div>
      </div>
    </>
  );
}
