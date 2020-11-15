node {
  stage('CheckOut'){
    checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'SubmoduleOption', disableSubmodules: false, parentCredentials: false, recursiveSubmodules: true, reference: '', trackingSubmodules: false]], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/southernwind/HomeDashboardFront']]])
  }

  stage('npm install') {
    nodejs('node12.18') {
      sh 'npm -prefix ./Front install'
    }
  }
  stage('Build'){
    nodejs('node12.18') {
      sh 'npm -prefix ./Front run build -- --c=production'
    }
  }

  withCredentials( \
      bindings: [sshUserPrivateKey( \
        credentialsId: 'ac005f9d-9b4b-496f-873c-1c610df01c03', \
        keyFileVariable: 'SSH_KEY', \
        usernameVariable: 'SSH_USER')]) {
    stage('Deploy FrontEnd'){
        sh 'scp -pr -i ${SSH_KEY} ./Front/dist/Front/* ${SSH_USER}@home-server.localnet:/var/www/html/dashboard'
    }
  }

  stage('Notify Slack'){
    sh 'curl -X POST --data-urlencode "payload={\\"channel\\": \\"#jenkins-deploy\\", \\"username\\": \\"jenkins\\", \\"text\\": \\"ダッシュボード(Front)のデプロイが完了しました。\\nBuild:${BUILD_URL}\\"}" ${WEBHOOK_URL}'
  }
}