import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://MauroRaya.github.io/02-TesteAutomatizado/');
  });

  // ========== GRUPO 1: Cadastro de Alunos ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verificar que o aluno aparece na tabela
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
    //   await expect(page.getByText('João Silva')).toBeVisible();

      await expect(page.getByRole('cell', { name: 'João Silva', exact: true })).toBeVisible();
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // A tabela deve continuar sem dados reais
      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 2: Cálculo de Média ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Média esperada: (8 + 6 + 10) / 3 = 8.00
      const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });

  });

  // ========== GRUPO 3: Validação de Notas ==========

  test.describe('Validação de Notas', () => {

    test('não deve aceitar notas maiores que 10', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Carlos Lima');
      await page.getByLabel('Nota 1').fill('11');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Não deve adicionar aluno na tabela
      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

    test('não deve aceitar notas menores que 0', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Marcos Souza');
      await page.getByLabel('Nota 1').fill('-1');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });


  // ========== GRUPO 4: Busca de Alunos ==========

  test.describe('Busca de Alunos', () => {

    test('deve filtrar alunos pelo nome digitado', async ({ page }) => {

      // Cadastro do primeiro aluno
      await page.getByLabel('Nome do Aluno').fill('Lucas Pereira');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Cadastro do segundo aluno
      await page.getByLabel('Nome do Aluno').fill('Fernanda Alves');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Busca pelo nome
      await page.locator('#busca').fill('Lucas');

      await expect(page.getByText('Lucas Pereira')).toBeVisible();
      await expect(page.getByText('Fernanda Alves')).not.toBeVisible();
    });

  });


  // ========== GRUPO 5: Exclusão de Alunos ==========

  test.describe('Exclusão de Alunos', () => {

    test('deve excluir um aluno da tabela', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Aluno Teste');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Clicar no botão excluir
      await page.getByRole('button', { name: 'Excluir' }).click();

      // Tabela volta ao estado vazio
      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });


  // ========== GRUPO 6: Situação do Aluno ==========

  test.describe('Situação do Aluno', () => {

    test('deve mostrar situação Aprovado quando média ≥ 7', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('9');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const situacao = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(5);
      await expect(situacao).toHaveText('Aprovado');
    });

    test('deve mostrar situação Recuperação quando média ≥ 5 e < 7', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Recuperacao');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const situacao = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(5);
      await expect(situacao).toHaveText('Recuperação');
    });

    test('deve mostrar situação Reprovado quando média < 5', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('2');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('3');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const situacao = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(5);
      await expect(situacao).toHaveText('Reprovado');
    });

  });


  // ========== GRUPO 7: Múltiplos Cadastros ==========

  test.describe('Múltiplos Cadastros', () => {

    test('deve cadastrar três alunos consecutivamente', async ({ page }) => {

      const alunos = [
        { nome: 'Aluno 1', n1: '4', n2: '8', n3: '10' },
        { nome: 'Aluno 2', n1: '9', n2: '7', n3: '6' },
        { nome: 'Aluno 3', n1: '3', n2: '5', n3: '4' },
      ];

      for (const aluno of alunos) {
        await page.getByLabel('Nome do Aluno').fill(aluno.nome);
        await page.getByLabel('Nota 1').fill(aluno.n1);
        await page.getByLabel('Nota 2').fill(aluno.n2);
        await page.getByLabel('Nota 3').fill(aluno.n3);

        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });

  });


  // ========== GRUPO 8: Estatísticas ==========

  test.describe('Estatísticas', () => {

    test('deve atualizar corretamente os cards de estatísticas', async ({ page }) => {

      // Aprovado
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Recuperação
      await page.getByLabel('Nome do Aluno').fill('Aluno Recuperacao');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Reprovado
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('2');
      await page.getByLabel('Nota 2').fill('3');
      await page.getByLabel('Nota 3').fill('4');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#stat-total')).toHaveText('3');
      await expect(page.locator('#stat-recuperacao')).toHaveText('1');
      await expect(page.locator('#stat-reprovados')).toHaveText('1');
    });

  });
});