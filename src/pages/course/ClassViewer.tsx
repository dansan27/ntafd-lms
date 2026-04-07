import { useRoute } from "wouter";
import ClassLayout from "@/components/layout/ClassLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Construction } from "lucide-react";
import { isClassAvailable, getClassConfig } from "@/data/courseConfig";

export default function ClassViewer() {
  const [match, params] = useRoute("/week/:week/class/:class");

  if (!match) return <div>Ruta no válida</div>;

  const weekId = parseInt(params.week, 10);
  const classId = parseInt(params.class, 10);

  if (isClassAvailable(weekId, classId)) {
    return <ClassLayout weekId={weekId} classId={classId} />;
  }

  const classConfig = getClassConfig(weekId, classId);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Clase en Desarrollo</h1>
        <p className="text-muted-foreground mb-6">
          {classConfig
            ? `"${classConfig.title}" está siendo preparada por el profesor.`
            : `El contenido para la Semana ${weekId}, Clase ${classId} está siendo preparado.`}
        </p>
        <Link href="/">
          <Button className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
