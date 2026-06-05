import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');

interface Baselines {
  mockData: { maxViolations: number };
  brandCompliance: { hardcodedHexInSrc: number };
  deadCodePatterns: { filesOnDisk: number };
  routerGuards: { issues: number };
}

class WebCleanAuditRunner {
  private readonly strict: boolean;

  public constructor(strict: boolean) {
    this.strict = strict;
  }

  public run(): void {
    const baselines = this.loadBaselines();
    const violations: string[] = [];

    const mockCount = this.countMockViolations();
    if (mockCount > (this.strict ? 0 : baselines.mockData.maxViolations)) {
      violations.push(`mockData: ${mockCount} violations (max ${this.strict ? 0 : baselines.mockData.maxViolations})`);
    }

    const hexCount = this.countPatternInDir(
      path.join(ROOT, 'src'),
      /#666|#888|#333|#0000ff|#4A90E2|color="gray"/g,
    );
    if (hexCount > (this.strict ? 0 : baselines.brandCompliance.hardcodedHexInSrc)) {
      violations.push(
        `brandCompliance.hardcodedHexInSrc: ${hexCount} (max ${this.strict ? 0 : baselines.brandCompliance.hardcodedHexInSrc})`,
      );
    }

    const deadFiles = this.countDeadFilesOnDisk();
    if (deadFiles > (this.strict ? 0 : baselines.deadCodePatterns.filesOnDisk)) {
      violations.push(`deadCodePatterns.filesOnDisk: ${deadFiles} (max ${this.strict ? 0 : baselines.deadCodePatterns.filesOnDisk})`);
    }

    const routerIssues = this.countRouterIssues();
    if (routerIssues > (this.strict ? 0 : baselines.routerGuards.issues)) {
      violations.push(`routerGuards: ${routerIssues} issues`);
    }

    if (violations.length > 0) {
      console.error('Clean audit failed:\n' + violations.map((v) => `  - ${v}`).join('\n'));
      process.exit(1);
    }

    console.log('Clean audit passed.');
  }

  private loadBaselines(): Baselines {
    const raw = fs.readFileSync(path.join(__dirname, 'baselines.json'), 'utf8');
    return JSON.parse(raw) as Baselines;
  }

  private walk(dir: string, onFile: (filePath: string) => void): void {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this.walk(full, onFile);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        onFile(full);
      }
    }
  }

  private countPatternInDir(dir: string, pattern: RegExp): number {
    let count = 0;
    this.walk(dir, (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    });
    return count;
  }

  private countMockViolations(): number {
    let count = 0;
    const mockDir = path.join(ROOT, 'src/constants/mock');
    if (fs.existsSync(mockDir)) count += 1;

    const scanDirs = ['src/pages', 'src/components', 'src/hooks'];
    const patterns = [
      /@\/constants\/mock/g,
      /pm_mock/g,
      /unsplash\.com/g,
      /mock-organizer/g,
    ];

    for (const dirName of scanDirs) {
      this.walk(path.join(ROOT, dirName), (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const pattern of patterns) {
          const matches = content.match(pattern);
          if (matches) count += matches.length;
        }
      });
    }

    return count;
  }

  private countDeadFilesOnDisk(): number {
    const denylist = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'deadCodeDenylist.json'), 'utf8'),
    ) as string[];

    return denylist.filter((rel) => fs.existsSync(path.join(ROOT, rel))).length;
  }

  private countRouterIssues(): number {
    let issues = 0;
    const appPath = path.join(ROOT, 'src/App.tsx');

    if (!fs.existsSync(appPath)) {
      return 1;
    }

    const appSource = fs.readFileSync(appPath, 'utf8');
    if (!appSource.includes('ProtectedRoute')) {
      issues += 1;
    }
    if (!appSource.includes('MainLayout')) {
      issues += 1;
    }
    if (!appSource.includes('delete-my-account')) {
      issues += 1;
    }

    return issues;
  }
}

const strict = process.argv.includes('--strict');
new WebCleanAuditRunner(strict).run();
