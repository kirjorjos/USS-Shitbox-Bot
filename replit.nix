{ pkgs }: {
	deps = [
   pkgs.unixtools.ping
   pkgs.iputils
   pkgs.openssh
		pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}