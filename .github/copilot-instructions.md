## Purpose

Help AI code agents quickly become productive in this repository (React + Vite app with Terraform + Ansible deployment).

## High-level architecture

- Frontend: single-page React app built with Vite. Source lives under `src/` with pages/components in `src/pages/*` and assets under `src/assets/` (e.g. `src/assets/assets/cards/Cards_data.js`).
- CI: Jenkins pipeline defined in the repository root `jenkinsfile`. Key pipeline stages: Checkout -> Build React -> Terraform Apply -> Ansible Deploy.
- Infra: Terraform lives in `terraform/` (uses AWS provider and an S3 backend declared in `terraform/provider.tf`). It provisions VPC, subnet, an EC2 instance and outputs `instance_public_ip`.
- Configuration & deploy: Ansible roles under `ansible/roles/react_web` manage installing packages, templating Nginx and unpacking the artifact. Inventory sample at `ansible/inventories/hosts.ini`.

## Quick developer workflows (concrete)

- Local dev with HMR: `npm install` then `npm run dev` (uses Vite). Frontend entry is `src/main.jsx` and `index.html`.
- Build (CI and release): `npm ci` followed by `npm run build`. The Jenkinsfile runs `npm ci` then `npm run build` inside the repo root.
- Lint: `npm run lint` (project uses ESLint config at `eslint.config.js`).
- Preview a build locally: `npm run preview`.

## CI / CD specifics (what agents need to know)

- The Jenkinsfile (root) installs Node/npm via `apt-get` in CI, runs `npm ci` and `npm run build`, then runs `terraform init` + `terraform apply` inside `terraform/`, and finally calls `ansible-playbook` with credentials.
- Terraform backend: `terraform/provider.tf` configures an S3 backend (bucket `react-deploy-bucket462`, region `ap-south-1`) and a DynamoDB lock table `terraform-locks`. Avoid changing backend names lightly.
- Ansible: playbook referenced by Jenkins is `ansible/playbook.yml` (not currently present). The actual role tasks are under `ansible/roles/react_web/tasks/*.yml`—these include package installs, nginx templating (`templates/nginx.react.j2`) and an `unarchive` task that expects `/tmp/react_build.tar.gz` on the remote host.

## Project-specific conventions and patterns

- CSS lives alongside components: e.g. `src/pages/Footer/Footer.css` and `Footer.jsx`—follow this colocated pattern for new components.
- Pages are grouped under `src/pages/<Name>/` where each page contains `<Name>.jsx` and `<Name>.css`.
- Static data / small mock datasets live in `src/assets/assets/*` (see `Cards_data.js`).
- ESLint is enabled and configured via `eslint.config.js` (use `npm run lint` before commits).

## Integration points & gotchas for code changes

- When changing build output (e.g. Vite public path, file names), update any Ansible unpack paths or Nginx templates in `ansible/roles/react_web/templates/nginx.react.j2`.
- Terraform outputs: changes to `terraform/main.tf` affect the instances that Ansible will target; confirm `ansible/inventories/hosts.ini` or dynamic inventory is updated after `terraform apply`.
- Jenkinsfile expects `ansible/playbook.yml` and credentials via Jenkins credentials IDs `jenkins-ssh-key-id` and `aws-creds`. Don't hardcode credentials in repo.

## Examples (where to change things)

- Add a new page: create `src/pages/NewPage/NewPage.jsx` and `NewPage.css`, export and route from `App.jsx`.
- Update deploy artifact: CI creates a build (via `npm run build`)—the Ansible role expects a tarball at `/tmp/react_build.tar.gz` on the target host and unpacks to `/var/www/react`.

## Safety & review rules for AI edits

- Do not change Terraform backend (S3 bucket / DynamoDB names) without human sign-off—these are shared state resources.
- If modifying CI (`jenkinsfile`) or deployment logic, include a short rationale in the PR and run the pipeline on a feature branch first.

If anything here is unclear or you want me to add examples (sample PR message, test snippets, or a checklist for changing infra/CICD), tell me which section and I will iterate.
