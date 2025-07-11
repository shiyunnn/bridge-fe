import { APIResponse, User } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskType } from "@/enums";
import useApiQuery from "@/hooks/useApiQuery";
import { cn } from "@/lib/utils";

interface SelectTeamMemberProps {
  value: string;
  onValueChange: (value: string) => void;
  taskType: TaskType;
  variant?: 'default' | 'small';
  className?: string;
}

const SelectTeamMember = ({
  value,
  onValueChange,
  taskType,
  variant = 'default',
  className = '',
}: SelectTeamMemberProps) => {
  const { data } = useApiQuery<APIResponse<User[]>>(
    '/users/',
    { task_type: !taskType ? '' : taskType },
  );
  const teamMembers = data?.data || [];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(variant === 'small' ? 'w-32 h-7 text-xs' : 'h-8', className)}>
        <SelectValue placeholder="Select assignee" />
      </SelectTrigger>
      <SelectContent>
        {teamMembers.map((member) => (
          <SelectItem key={member.id} value={`${member.id}`}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectTeamMember;
