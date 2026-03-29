import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageToast } from "@/components/ui/page-toast";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/formatters";
import { requireAdminUser } from "@/modules/auth/guards";
import { createUserAction, resetUserPasswordAction, updateUserRoleAction } from "@/modules/users/actions";
import { listUsers } from "@/modules/users/repository";

function getTeamToast(success?: string) {
  switch (success) {
    case "created":
      return "Usuario criado com sucesso.";
    case "updated":
      return "Perfil do usuario atualizado.";
    case "password":
      return "Senha redefinida com sucesso.";
    default:
      return null;
  }
}

export default async function TeamPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>;
}) {
  await requireAdminUser();
  const [users, query] = await Promise.all([listUsers(), searchParams]);

  return (
    <AdminShell
      title="Time e permissoes"
      description="Gerencie acessos do time, contas de clientes e papeis operacionais sem depender de configuracao manual no banco."
    >
      <PageToast message={getTeamToast(query?.success)} />
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-6">
          <h2 className="font-display text-2xl text-ink-950">Novo usuario</h2>
          <form action={createUserAction} className="mt-6 grid gap-4">
            <Input name="name" placeholder="Nome" required />
            <Input name="email" placeholder="Email" required type="email" />
            <Select defaultValue="ACCOUNT_MANAGER" name="role">
              <option value="ADMIN">Admin</option>
              <option value="ACCOUNT_MANAGER">Account manager</option>
              <option value="CLIENT">Cliente</option>
            </Select>
            <Input name="password" placeholder="Senha inicial" required type="password" />
            <Button type="submit">Criar usuario</Button>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Usuario</TableHeaderCell>
                  <TableHeaderCell>Papel</TableHeaderCell>
                  <TableHeaderCell>Criado em</TableHeaderCell>
                  <TableHeaderCell className="text-right">Acoes</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="font-medium text-ink-950">{user.name}</p>
                      <p className="text-xs text-ink-950/55">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge tone={user.role === "ADMIN" ? "success" : "neutral"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-2">
                        <form action={updateUserRoleAction} className="flex items-center gap-2">
                          <input name="id" type="hidden" value={user.id} />
                          <Select defaultValue={user.role} name="role">
                            <option value="ADMIN">Admin</option>
                            <option value="ACCOUNT_MANAGER">Account manager</option>
                            <option value="CLIENT">Cliente</option>
                          </Select>
                          <Button size="sm" type="submit" variant="secondary">
                            Atualizar papel
                          </Button>
                        </form>
                        <form action={resetUserPasswordAction} className="flex items-center gap-2">
                          <input name="id" type="hidden" value={user.id} />
                          <Input minLength={6} name="password" placeholder="Nova senha" type="password" />
                          <Button size="sm" type="submit" variant="ghost">
                            Resetar senha
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
