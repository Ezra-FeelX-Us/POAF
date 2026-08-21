import prisma from "@/lib/prisma";

export async function generatePoafId(type: 'MEM' | 'LDR' | 'APP' | 'PRJ' | 'CHP' | 'PTN' | 'TSK'): Promise<string> {
  const prefix = `POAF-${type}-`;
  
  let count = 0;
  
  switch(type) {
    case 'MEM':
      count = await prisma.member.count();
      break;
    case 'LDR':
      count = await prisma.member.count({ where: { isLeader: true } });
      break;
    case 'APP':
      count = await prisma.application.count();
      break;
    case 'PRJ':
      count = await prisma.project.count();
      break;
    case 'PTN':
      count = await prisma.partnership.count();
      break;
    case 'TSK':
      count = await prisma.task.count();
      break;
  }
  
  const sequentialNumber = (count + 1).toString().padStart(4, '0');
  
  return `${prefix}${sequentialNumber}`;
}
