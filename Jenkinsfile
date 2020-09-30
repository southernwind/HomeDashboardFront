node {
  stage('CheckOut'){
    checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'SubmoduleOption', disableSubmodules: false, parentCredentials: false, recursiveSubmodules: true, reference: '', trackingSubmodules: false]], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/southernwind/HomeServer']]])
  }

  stage('Configuration'){
    configFileProvider([configFile(fileId: '626675d6-7479-4537-88d9-5dc14eb34765', targetLocation: 'Back/appsettings.json')]) {}
  }

  stage('Build FrontEnd'){
    nodejs('node12.18') {
      sh 'npm -prefix ./Front install'
      sh 'npm -prefix ./Front run build -- --c=production'
    }
  }

  stage('Build BackEnd'){
    dotnetBuild configuration: 'Release', project: 'HomeServer.sln', runtime: 'linux-x64', sdk: '.NET3.1', unstableIfWarnings: true
  }

  withCredentials( \
      bindings: [sshUserPrivateKey( \
        credentialsId: 'ac005f9d-9b4b-496f-873c-1c610df01c03', \
        keyFileVariable: 'SSH_KEY', \
        usernameVariable: 'SSH_USER')]) {
    stage('Deploy FrontEnd'){
        sh 'scp -pr -i ${SSH_KEY} ./Front/dist/Front/* ${SSH_USER}@home-server.localnet:/var/www/html/dashboard'
    }

    stage('Deploy BackEnd'){
      sh 'scp -pr -i ${SSH_KEY} ./Back/bin/Release/netcoreapp3.1/linux-x64/* ${SSH_USER}@home-server.localnet:/var/www/html/dashboard-api'
    }

    stage('Restart BackEndService'){
      sh 'ssh home-server.localnet -t -l ${SSH_USER} -i ${SSH_KEY} sudo service back_end_api restart'
    }
  }

  stage('Notify Slack'){
    sh 'curl -X POST --data-urlencode "payload={\\"channel\\": \\"#jenkins-deploy\\", \\"username\\": \\"jenkins\\", \\"text\\": \\"デプロイが完了しました。\\nBuild:${BUILD_URL}\\"}" ${WEBHOOK_URL}'
  }
}