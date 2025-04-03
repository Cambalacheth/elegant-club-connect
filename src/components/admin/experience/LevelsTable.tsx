
import { LEVEL_THRESHOLDS, LEVEL_NAMES } from "@/types/user";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const LevelsTable = () => {
  const levelData = LEVEL_THRESHOLDS.map((threshold, index) => {
    const level = index + 1;
    const levelName = LEVEL_NAMES[level as keyof typeof LEVEL_NAMES] || "Desconocido";
    
    // Get unlocks based on level
    let unlocks = [];
    
    if (level >= 2) unlocks.push("Crear comentarios y votar");
    if (level >= 4) unlocks.push("Crear debates en el foro");
    if (level >= 8) unlocks.push("Moderar contenido");
    if (level >= 10) unlocks.push("Gestionar contenido");
    if (level === 13) unlocks.push("Acceso a panel de administración");
    
    const nextLevel = LEVEL_THRESHOLDS[index + 1];
    const xpRequired = nextLevel ? nextLevel - threshold : "Máximo";
    
    return {
      level,
      name: levelName,
      minXp: threshold,
      xpToNext: xpRequired,
      unlocks: unlocks.join(", ")
    };
  });

  return (
    <Table>
      <TableCaption>Sistema de niveles de Terreta Hub</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nivel</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>XP Mínima</TableHead>
          <TableHead>XP para siguiente nivel</TableHead>
          <TableHead className="w-1/3">Desbloqueos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {levelData.map((item) => (
          <TableRow key={item.level}>
            <TableCell className="font-medium">{item.level}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.minXp}</TableCell>
            <TableCell>{typeof item.xpToNext === "string" ? item.xpToNext : item.xpToNext}</TableCell>
            <TableCell>{item.unlocks}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LevelsTable;
