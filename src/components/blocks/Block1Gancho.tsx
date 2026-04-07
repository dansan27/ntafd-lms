import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Block1Gancho() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <Zap className="text-red-500" />
        El Gancho
      </h2>
      <p className="mt-4">
        Contenido del bloque 1: Lanzamiento humano como tecnología.
      </p>
    </motion.div>
  );
}